// Date and time utility functions with UTC support

// Get current UTC date
export function getCurrentUTCDate(): Date {
  return new Date();
}

// Get current UTC time in hours
export function getCurrentUTCHour(): number {
  return new Date().getUTCHours();
}

// Check if a date is in the past
export function isDateInPast(date: Date): boolean {
  const now = new Date();
  return date < now;
}

// Check if a specific date and hour is in the past
export function isDateTimeInPast(date: Date, hour: number): boolean {
  const now = new Date();
  const targetDate = new Date(date);
  targetDate.setUTCHours(hour, 0, 0, 0);
  return targetDate < now;
}

// Get available dates starting from today (no past dates)
export function getAvailableDates(daysAhead: number = 30): Date[] {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = 0; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() + i);
    dates.push(date);
  }

  return dates;
}

// Format date for display (e.g., "Monday, January 15")
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Format date for input value (YYYY-MM-DD)
export function formatDateForInput(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Format time for display (e.g., "2:00 PM")
export function formatTimeForDisplay(hour: number): string {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:00 ${period}`;
}

// Get month name from month number
export function getMonthName(month: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month - 1];
}

// Get day name from date
export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
}

// Check if a date is today
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

// Check if a date is tomorrow
export function isTomorrow(date: Date): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return date.toDateString() === tomorrow.toDateString();
}

// Get relative date description
export function getRelativeDateDescription(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return formatDateForDisplay(date);
}

// Convert local time to UTC for a specific date
export function localToUTC(date: Date, localHour: number): number {
  const localDate = new Date(date);
  localDate.setHours(localHour, 0, 0, 0);
  return localDate.getUTCHours();
}

// Convert UTC time to local for a specific date
export function utcToLocal(date: Date, utcHour: number): number {
  const utcDate = new Date(date);
  utcDate.setUTCHours(utcHour, 0, 0, 0);
  return utcDate.getHours();
}
