/**
 * Get the ordinal suffix for a number.
 * @param value - The number to get the ordinal suffix for.
 * @returns The ordinal suffix for the number. E.g. 1st, 2nd, 3rd, 4th, etc.
 */
export function getOrdinalSuffix(value: number): string {
  if (value > 3 && value < 21) {
    return 'th';
  }

  switch (value % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

/**
 * Get a long date string in the format "Month Day(ordinal), Year".
 * @param date - The date to get the long date string for.
 * @returns The long date string.
 */
export function getLongDateString(date: Date): string | null {
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // FriendDev: Override the format for the day to include the ordinal suffix.
  let result = '';
  for (const { type, value } of formatter.formatToParts(date)) {
    if (type === 'day') {
      const dayNumber = Number.parseInt(value, 10);
      result += Number.isNaN(dayNumber) ? value : `${value}${getOrdinalSuffix(dayNumber)}`;
    } else {
      result += value;
    }
  }
  return result;
}

/**
 * Get a long date string with time in the format "Weekday, Month Day(ordinal), Year at h:mm A".
 * @param date - The date to get the long date and time string for.
 * @returns The long date and time string.
 */
export function getLongDateTimeString(date: Date): string | null {
  const dateString = getLongDateString(date);
  if (!dateString) {
    return null;
  }

  const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return `${dateString} at ${timeFormatter.format(date)}`;
}