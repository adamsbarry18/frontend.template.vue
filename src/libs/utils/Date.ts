import dayjs from 'dayjs';
import enLang from 'dayjs/locale/en';
import frLang from 'dayjs/locale/fr';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isBetween from 'dayjs/plugin/isBetween';
import timezonePlugin from 'dayjs/plugin/timezone';
import utcPlugin from 'dayjs/plugin/utc';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import i18n from '@/i18n';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
dayjs.extend(timezonePlugin);
dayjs.extend(utcPlugin);

// To have start of the week on Monday in english
dayjs.extend(updateLocale);
dayjs.extend(weekOfYear);
dayjs.updateLocale('en', {
  weekStart: 1,
});

/**
 * Days of the week constants.
 */
export const DAYS_OF_WEEK = {
  MON: 'MON',
  TUE: 'TUE',
  WED: 'WED',
  THU: 'THU',
  FRI: 'FRI',
  SAT: 'SAT',
  SUN: 'SUN',
} as const;
export type DayOfWeek = keyof typeof DAYS_OF_WEEK;

/**
 * Days of the week to integer mapping (Monday as 1, Sunday as 0).
 */
export const DAYS_OF_WEEK_TO_INT: { [key in DayOfWeek]: number } = {
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
  SUN: 0,
};

/**
 * Time scale constants.
 */
export const TIME_SCALE = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
} as const;
export type TimeScale = keyof typeof TIME_SCALE;

/**
 * Returns aggregated date depending on time scale.
 * @param date String or Date representing the date.
 * @param timeScale Time scale to aggregate by (DAY, WEEK, MONTH).
 * @returns Formatted date string in 'YYYY-MM-DD' format.
 */
export const getAggregatedDate = (
  date: string | Date,
  timeScale: TimeScale
): string => {
  const dayjsDate = dayjs(date);
  switch (timeScale) {
    case 'WEEK':
      return dayjsDate.startOf('week').format('YYYY-MM-DD');
    case 'MONTH':
      return dayjsDate.startOf('month').format('YYYY-MM-DD');
    case 'DAY':
    default:
      return dayjsDate.format('YYYY-MM-DD');
  }
};

const MILLISECONDS_IN_A_DAY = 86400000; // 24 * 60 * 60 * 1000
const MILLISECONDS_IN_A_MINUTE = 60000; // 60 * 1000

/**
 * Gets the UTC offset in minutes for a given timezone.
 * @param timezone Timezone string (e.g., 'America/New_York').
 * @returns UTC offset in minutes.
 */
export function getUtcOffsetForTimezone(timezone: string): number {
  return dayjs().tz(timezone).utcOffset();
}

/**
 * Calculates the number of days since the epoch (Jan 1, 1970) for a given date.
 * @param date Date object.
 * @param utcOffset UTC offset in minutes. Default is 0.
 * @returns Number of days since the epoch.
 */
export function getDaysSinceEpoch(date: Date, utcOffset: number = 0): number {
  const ms = date.getTime() + utcOffset * MILLISECONDS_IN_A_MINUTE;
  return Math.floor(ms / MILLISECONDS_IN_A_DAY);
}

/**
 * Checks if two date periods are overlapping.
 * @param periodA Array of two Dates representing the start and end of period A.
 * @param periodB Array of two Dates representing the start and end of period B.
 * @param utcOffset UTC offset in minutes. Default is 0.
 * @returns True if the periods overlap, false otherwise.
 */
export function arePeriodsOverlapping(
  [periodAStartDate, periodAEndDate]: [Date, Date],
  [periodBStartDate, periodBEndDate]: [Date, Date],
  utcOffset: number = 0
): boolean {
  const daysAStart = getDaysSinceEpoch(periodAStartDate, utcOffset);
  const daysAEnd = getDaysSinceEpoch(periodAEndDate, utcOffset);
  const daysBStart = getDaysSinceEpoch(periodBStartDate, utcOffset);
  const daysBEnd = getDaysSinceEpoch(periodBEndDate, utcOffset);

  return daysAStart <= daysBEnd && daysBStart <= daysAEnd;
}

/**
 * Gets the number of days in a given month and year.
 * @param year Year (e.g., 2023).
 * @param month Month (1 for January, 12 for December).
 * @returns Number of days in the month.
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Date formats by language.
 */
export const dateFormatByLang: { [lang: string]: string } = {
  en: 'YYYY/MM/DD',
  fr: 'DD/MM/YYYY',
};

/**
 * DateTime formats by language.
 */

export const dateTimeFormatByLang: { [lang: string]: string } = {
  en: 'YYYY/MM/DD HH:mm',
  fr: 'DD/MM/YYYY HH:mm',
};

export const getDateFormatByLang = (lang: string): string => {
  return dateFormatByLang[lang] || dateFormatByLang.en;
};

export const getDateTimeFormatByLang = (lang: string): string => {
  return dateTimeFormatByLang[lang] || dateTimeFormatByLang.en;
};

/**
 * Checks if two dates are on the same day.
 * @param firstDate First Date object.
 * @param secondDate Second Date object.
 * @returns True if the dates are on the same day, false otherwise.
 */
export function datesAreOnSameDay(
  firstDate: Date | null,
  secondDate: Date | null
): boolean {
  if (!firstDate || !secondDate) {
    return false;
  }
  return dayjs(firstDate).isSame(secondDate, 'day');
}

/**
 * Converts duration in seconds to a human-readable string (e.g., "1h 30min 15s").
 * @param seconds Duration in seconds.
 * @returns Human-readable duration string. Returns an empty string if seconds is 0.
 */
export const humanizeDuration = (seconds: number): string => {
  if (seconds === 0) {
    return '';
  }

  const secondTrad = i18n.global.t('commons.seconds.small');
  const minuteTrad = i18n.global.t('commons.minutes.small');
  const hourTrad = i18n.global.t('commons.hours.small');

  const nbSecondsInHour = 3600;
  const hours = Math.floor(seconds / nbSecondsInHour);
  let remainingSeconds = seconds - hours * nbSecondsInHour;

  const nbSecondsInMinute = 60;
  const minutes = Math.floor(remainingSeconds / nbSecondsInMinute);
  remainingSeconds -= minutes * nbSecondsInMinute;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${hourTrad}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${minuteTrad}`);
  }
  if (remainingSeconds > 0 || (hours === 0 && minutes === 0 && seconds > 0)) {
    // Always show seconds if total duration is > 0 and hours/minutes are 0
    parts.push(`${remainingSeconds}${secondTrad}`);
  }

  return parts.join(' ');
};

/**
 * Initializes Dayjs locale based on the provided language.
 * @param lang Language code (e.g., 'en', 'fr').
 */
export const initializeDateLocale = (lang: string): void => {
  const dayJsLocales: { [lang: string]: ILocale } = {
    // Corrected type to ILocale
    en: enLang,
    fr: frLang,
  };
  dayjs.locale(dayJsLocales[lang] || 'en');
};

/**
 * Checks if a date is a valid Date object.
 * @param date Date to validate.
 * @returns True if the date is a valid Date object and not NaN, false otherwise.
 */
export const isDateValid = (date): boolean =>
  date instanceof Date && !isNaN(date.getTime());

/**
 * Checks if a date is in the future compared to the current time.
 * @param date Date to check.
 * @returns True if the date is in the future, false otherwise.
 */
export const isDateInTheFuture = (date: Date): boolean =>
  dayjs(date).isAfter(dayjs());

/**
 * Rounds a Date object to the nearest interval in minutes.
 * @param date Date to round.
 * @param interval Interval in minutes.
 * @returns Rounded Date object.
 */
export const roundDate = (date: Date, interval: number): Date => {
  return dayjs(date)
    .minute(Math.round(dayjs(date).minute() / interval) * interval)
    .toDate();
};
