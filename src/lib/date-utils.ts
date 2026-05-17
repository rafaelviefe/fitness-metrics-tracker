export const formatIsoToDateTimeLocal = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  // Ensure the date object is valid before formatting
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided to formatIsoToDateTimeLocal:", isoDateString);
    // Fallback to current local time if date is invalid to prevent input crash
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}T${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Formats an ISO date string into a display-friendly local date string (e.g., "October 27, 2023").
 * Handles invalid date strings gracefully by returning 'Invalid Date' and logging an error.
 * @param isoDateString The ISO 8601 date string to format.
 * @returns The formatted date string or 'Invalid Date' if the input is invalid.
 */
export const formatDateForDisplay = (isoDateString: string): string => {
  // Explicitly check for inputs that should result in 'Invalid Date' according to our logic,
  // even if new Date() might interpret them differently (e.g., null, undefined, empty string can become epoch).
  if (!isoDateString || (typeof isoDateString !== 'string')) {
    console.error("Invalid date string provided to formatDateForDisplay:", isoDateString);
    return 'Invalid Date';
  }

  const trimmedDateString = isoDateString.trim();
  if (trimmedDateString === '') {
    console.error("Invalid date string provided to formatDateForDisplay:", isoDateString);
    return 'Invalid Date';
  }

  const date = new Date(trimmedDateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided to formatDateForDisplay:", trimmedDateString);
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats an ISO date string into a display-friendly local date and time string (e.g., "Month Day, Year, HH:MM AM/PM").
 * Handles invalid date strings gracefully by returning 'Invalid Date' and logging an error.
 * @param isoDateString The ISO 8601 date string to format.
 * @returns The formatted date and time string or 'Invalid Date' if the input is invalid.
 */
export const formatDateWithTimeForDisplay = (isoDateString: string): string => {
  if (!isoDateString || (typeof isoDateString !== 'string')) {
    console.error("Invalid date string provided to formatDateWithTimeForDisplay:", isoDateString);
    return 'Invalid Date';
  }

  const trimmedDateString = isoDateString.trim();
  if (trimmedDateString === '') {
    console.error("Invalid date string provided to formatDateWithTimeForDisplay:", isoDateString);
    return 'Invalid Date';
  }

  const date = new Date(trimmedDateString);
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided to formatDateWithTimeForDisplay:", trimmedDateString);
    return 'Invalid Date';
  }
  
  // Separate date and time formatting to control the separator and hour format
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric', // Use 'numeric' to avoid leading zeros for single-digit hours
    minute: '2-digit',
    hour12: true,
  });

  return `${formattedDate}, ${formattedTime}`;
};
