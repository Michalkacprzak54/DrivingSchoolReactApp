// src/utils/dateUtils.js
import { format, toZonedTime } from 'date-fns-tz';

const timeZone = 'Europe/Warsaw';

/**
 * Get the current date formatted as a zoned time string.
 * @returns {string} - The current date in "yyyy-MM-dd'T'HH:mm:ss.SSSXXX" format for the Europe/Warsaw timezone.
 */
export function getZonedCurrentDate() {
    const currentDate = new Date().toISOString();
    const zonedDate = toZonedTime(currentDate, timeZone);
    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", { timeZone });
}
