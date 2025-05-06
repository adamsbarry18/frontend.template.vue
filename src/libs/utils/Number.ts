import i18n from '@/i18n';
/** Maximum 32-bit signed integer value */
export const MAX_INT: number = 2147483647; // 2147483647 = 2^31 - 1
/** Minimum 32-bit signed integer value */
export const MIN_INT: number = -MAX_INT - 1; // -2147483648 = -2^31

/**
 * Returns '+' for positive or zero numbers, and '' for negative numbers.
 * @param value The number to check.
 * @returns '+' if value is non-negative, '' otherwise.
 */
export const signNumber = (value: number): string => (value >= 0 ? '+' : '');

/**
 * Threshold definition for number condensation.
 */
interface CondenseThreshold {
  value: number;
  label: string;
}

/**
 * Returns an array of thresholds for number condensation.
 * @returns Array of CondenseThreshold objects.
 */
export function getCondenseThresholds(): CondenseThreshold[] {
  return [
    { value: 1000, label: i18n.global.t('commons.number.unit.1000') },
    { value: 1000000, label: i18n.global.t('commons.number.unit.1000000') },
    {
      value: 1000000000,
      label: i18n.global.t('commons.number.unit.1000000000'),
    },
  ];
}

/**
 * Sets the precision of a number using rounding.
 * @param value The number to set precision for.
 * @param precision Number of decimal places. Default is 0.
 * @returns Number with specified precision.
 */
export function setPrecision(value: number, precision: number = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * Checks if a number is effectively zero at a given maximum precision.
 * @param value The number to check (can be a number or a string).
 * @param maxPrecision The maximum decimal precision to consider.
 * @returns True if the number is effectively zero, false otherwise.
 */
export function checkIsReducedNumberZero(value: number | string, maxPrecision: number): boolean {
  const number = typeof value === 'string' ? parseFloat(value) : value;
  return parseFloat(number.toFixed(maxPrecision)) === 0;
}

/**
 * Currency symbols mapping.
 */
export const currencySymbols: { [key: string]: string } = {
  CAD: '$',
  CHF: 'CHF',
  CNY: '¥',
  DKK: 'kr ',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  USD: '$',
};

/**
 * Options for the numberFormat function.
 */
interface NumberFormatOptions {
  currency?: string;
  precision?: number;
  maxPrecision?: number;
  condensed?: boolean;
  unit?: string;
  locale?: string;
  signNumber?: boolean;
}

/**
 * Formats a number according to the given options, using i18n for localization.
 * @param value The number to format.
 * @param options Formatting options.
 * @returns Formatted number string.
 */
export const numberFormat = (value: number, options: NumberFormatOptions = {}): string => {
  if ((!value && value !== 0) || isNaN(value)) {
    return '-';
  }

  let res: number = value;
  let suffix: string = '';
  let isReducedNumberZero: boolean = false;
  // Use .value to get the string locale from WritableComputedRef
  const currentLocale: string = i18n.global.locale.value;
  const i18nOptions: Intl.NumberFormatOptions = {};

  const { currency, precision, maxPrecision, condensed, unit, signNumber } = options;

  if (currency && precision === undefined && (!condensed || (condensed && value < 1000))) {
    i18nOptions.minimumFractionDigits = 2;
    i18nOptions.maximumFractionDigits = 2;
  }

  if (precision !== undefined && precision >= 0) {
    i18nOptions.minimumFractionDigits = precision;
    i18nOptions.maximumFractionDigits = precision;
  }

  if (maxPrecision !== undefined && maxPrecision >= 0) {
    i18nOptions.minimumFractionDigits = 0;
    i18nOptions.maximumFractionDigits = maxPrecision;
    isReducedNumberZero = checkIsReducedNumberZero(value, maxPrecision);
  }

  if (condensed) {
    const threshold = getCondenseThresholds()
      .filter((t) => t.value < Math.abs(res))
      .sort((a, b) => b.value - a.value) // Sort descending for shift() to get largest
      .shift();

    if (threshold) {
      res /= threshold.value;
      suffix = threshold.label;
      if (precision === undefined) {
        i18nOptions.maximumFractionDigits = 1;
      }
    }
  }

  if (unit) {
    suffix = suffix ? `${suffix} ${unit}` : unit;
  }

  let formattedValue: string = i18n.global.n(res, i18nOptions);

  if (suffix) {
    formattedValue += ` ${suffix}`;
  }

  if (currency) {
    const currencySymbol = currencySymbols[currency] || currency;
    formattedValue = currentLocale.toLowerCase().startsWith('en') // Use .toLowerCase() on string
      ? formattedValue.startsWith('-')
        ? formattedValue.replace('-', `-${currencySymbol}`)
        : `${currencySymbol}${formattedValue}`
      : `${formattedValue}${currencySymbol}`;
  }

  if (signNumber) {
    if (isReducedNumberZero) {
      formattedValue = formattedValue.replace('-', ''); // Remove negative sign for "zero"
    } else if (value > 0) {
      formattedValue = `+ ${formattedValue}`;
    } else if (Math.abs(value) < Number.EPSILON) {
      formattedValue = `± ${formattedValue}`;
    } else if (value < 0) {
      formattedValue = formattedValue.replace('-', '- '); // Add space after negative sign
    }
  }

  return formattedValue;
};

/**
 * Returns the ordinal form of a number (e.g., 1st, 2nd, 3rd).
 * @param number The number to ordinalize.
 * @returns Ordinal string representation of the number.
 * @throws Error if the number is not an integer or is negative.
 */
export const ordinalize = (number: number): string => {
  if (!Number.isInteger(number)) {
    throw new Error('Number must be an integer');
  }
  if (number < 0) {
    throw new Error('Number must be positive');
  }

  if (number === 0) {
    return '0';
  }

  // Use .value to get the string locale from WritableComputedRef
  const lang: string = i18n.global.locale.value || 'en';
  let ordinalSuffix: string = '';

  if (lang === 'fr') {
    // Compare string value
    ordinalSuffix = number === 1 ? 'er' : 'ème';
  } else if (lang === 'en') {
    // Compare string value
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      ordinalSuffix = 'th';
    } else {
      switch (lastDigit) {
        case 1:
          ordinalSuffix = 'st';
          break;
        case 2:
          ordinalSuffix = 'nd';
          break;
        case 3:
          ordinalSuffix = 'rd';
          break;
        default:
          ordinalSuffix = 'th';
          break;
      }
    }
  }

  return `${number}${ordinalSuffix}`;
};

/**
 * Returns parsed float from string value or null if unable to parse.
 * @param value String value to parse.
 * @returns Parsed float number or null if parsing fails.
 */
export function tryParseFloat(value: string): number | null {
  const parsedValue = parseFloat(value);
  return isNaN(parsedValue) ? null : parsedValue;
}

/**
 * Formats file size in bytes to a human-readable string with appropriate units (B, kB, MB).
 * @param fileSize File size in bytes.
 * @returns Formatted file size string.
 */
export function formatFileSize(fileSize: number): string {
  let unit: string = i18n.global.t('commons.file-size.unit.MB');
  let factor: number = 1000000; // Corrected to MB factor (10^6)
  let precision: number = 1;

  if (fileSize < 1000) {
    unit = i18n.global.t('commons.file-size.unit.B');
    precision = 0;
    factor = 1;
  } else if (fileSize < 1000000) {
    unit = i18n.global.t('commons.file-size.unit.kB');
    factor = 1000;
  }

  return numberFormat(fileSize / factor, { unit, precision });
}

/**
 * Returns the sum of numbers in an array.
 * @param array Array of numbers to sum.
 * @returns Sum of the array, or 0 if the array is empty.
 */
export function getSum(array: number[]): number {
  return array.length === 0 ? 0 : array.reduce((a, b) => a + b, 0);
}

/**
 * Returns the average of numbers in an array.
 * @param array Array of numbers to average.
 * @returns Average of the array, or 0 if the array is empty.
 */
export function getAverage(array: number[]): number {
  return array.length === 0 ? 0 : getSum(array) / array.length;
}
