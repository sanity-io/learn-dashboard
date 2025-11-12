/**
 * Formats a date string or Date object to YY/MM/DD format
 * @param date - Date string or Date object
 * @returns Formatted date string in YY/MM/DD format
 */
export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  const year = d.getFullYear().toString()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
