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