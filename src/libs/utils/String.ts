import dayjs from 'dayjs';
import i18n from '@/i18n';

// Function to validate email
export const isEmailValid = (value: string): boolean => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(value);
};

// Function to validate URL
export const isUrlValid = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export function formatBool(
  value: boolean | null | undefined,
  config: { trueLabel?: string; falseLabel?: string }
): string {
  if (value === true) {
    return config.trueLabel ?? i18n.global.t('commons.yes');
  }
  if (value === false) {
    return config.falseLabel ?? i18n.global.t('commons.no');
  }
  return '-';
}

// Function to generate a unique ID
export const generateUID = (nbParam: number = 10): string => {
  let mask = '';
  for (let i = 0; i < nbParam; i++) {
    mask += 'x';
  }
  return mask.replace(/x/g, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toLowerCase()
  );
};

// Function to add ellipsis to multiline text
export const multilineEllipsis = (
  value: string,
  maxLength: number = 7
): string => {
  return value
    .split(' ')
    .map((v) => (v.length > maxLength ? `${v.substring(0, maxLength)}…` : v))
    .join('\n');
};

// Function to add ellipsis to single line text
export const ellipsis = (value: string, maxLength: number = 30): string => {
  return value.length > maxLength
    ? `${value.substring(0, maxLength - 3)}…`
    : value;
};

// Function to format a number range
export const formatNumberRange = (
  value: [number | null, number | null],
  config: { unit?: string } = {}
): string => {
  if (
    !value ||
    value.length !== 2 ||
    (!Number.isFinite(value[0]) && !Number.isFinite(value[1]))
  ) {
    return '-';
  }
  if (!Number.isFinite(value[0])) {
    return `≤ ${value[1]}${config.unit ? ` ${config.unit}` : ''}`;
  }
  if (!Number.isFinite(value[1])) {
    return `≥ ${value[0]}${config.unit ? ` ${config.unit}` : ''}`;
  }
  return `${value[0]} - ${value[1]}${config.unit ? ` ${config.unit}` : ''}`;
};

// Function to format a date range
export const formatDateRange = (value: [Date | null, Date | null]): string => {
  if (
    !value ||
    value.length !== 2 ||
    (value[0] === null && value[1] === null)
  ) {
    return '-';
  }
  if (value[1] === null) {
    return `${i18n.global.t('commons.after')} ${i18n.global.d(new Date(value[0]), 'short')}`;
  }
  if (value[0] === null) {
    return `${i18n.global.t('commons.before')} ${i18n.global.d(new Date(value[1]), 'short')}`;
  }
  return `${i18n.global.d(new Date(value[0]), 'short')} - ${i18n.global.d(new Date(value[1]), 'short')}`;
};

// Function to format an enum value
export const formatEnum = (
  value: string[],
  config: { options: { value: string; label: string }[] }
): string => {
  const themeArray =
    value.length > 0
      ? value.map(
          (x) =>
            config.options.find((y) => y.value === x)?.label ||
            i18n.global.t('commons.filter-invalid-value')
        )
      : ['-'];
  return themeArray.join(', ');
};

// Type formatter object
const typeFormater = {
  daterange: formatDateRange,
  numberrange: formatNumberRange,
  enum: formatEnum,
};

// Function to format value to string based on type
export const formatToString = (
  value: unknown,
  config: { type: string; [key: string]: unknown }
): string => {
  return typeFormater.hasOwnProperty(config.type)
    ? typeFormater[config.type](value, config)
    : `${value}`;
};

// Function to capitalize the first letter of a string
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Function to format date for graph axis
export const dateGraphAxisFormatter = (value: string): string => {
  const date = new Date(value);
  const label = capitalize(i18n.global.d(date, 'monthYear'));
  if (dayjs(date).get('month') !== 0) {
    return label.split(' ')[0];
  }
  return label.replace(' ', '\n');
};

// Function to count words in a string
export const countWords = (value: string): number => {
  return value?.trim()?.split(/\s+/)?.length ?? 0;
};

// Function to count lines in a string
export const countLines = (value: string): number => {
  return (value?.match(/\n+/g)?.length ?? 0) + 1;
};
