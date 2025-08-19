// Scheduling configuration for blacklisted dates and times
export interface BlacklistedTime {
  hour: number; // 0-23 (24-hour format)
  reason?: string;
}

export interface BlacklistedDate {
  month: number; // 1-12
  day: number; // 1-31
  reason?: string;
}

export interface BlacklistedTimeRange {
  startHour: number; // 0-23
  endHour: number; // 0-23 (exclusive)
  reason?: string;
}

// Blacklisted time slots (hours when booking is not allowed)
export const BLACKLISTED_TIMES: BlacklistedTime[] = [
  { hour: 17, reason: "Dinner time" },
  { hour: 18, reason: "Dinner time" },
  { hour: 19, reason: "Dinner time" },
];

// Blacklisted specific dates (month/day combinations)
export const BLACKLISTED_DATES: BlacklistedDate[] = [
  { month: 8, day: 5, reason: "Holiday" }, // August 5th
  { month: 12, day: 25, reason: "Christmas" }, // December 25th
  { month: 1, day: 1, reason: "New Year's Day" }, // January 1st
];

// Blacklisted time ranges (when booking is not allowed for extended periods)
export const BLACKLISTED_TIME_RANGES: BlacklistedTimeRange[] = [
  { startHour: 22, endHour: 6, reason: "After hours" }, // 10 PM to 6 AM
];

// Check if a specific hour is blacklisted
export function isHourBlacklisted(hour: number): boolean {
  // Check individual blacklisted hours
  if (BLACKLISTED_TIMES.some((bt) => bt.hour === hour)) {
    return true;
  }

  // Check blacklisted time ranges
  return BLACKLISTED_TIME_RANGES.some(
    (range) => hour >= range.startHour || hour < range.endHour,
  );
}

// Check if a specific date is blacklisted
export function isDateBlacklisted(month: number, day: number): boolean {
  return BLACKLISTED_DATES.some((bd) => bd.month === month && bd.day === day);
}

// Get available hours for a given date
export function getAvailableHours(date: Date): number[] {
  const availableHours: number[] = [];

  for (let hour = 6; hour < 22; hour++) {
    // 6 AM to 10 PM
    if (!isHourBlacklisted(hour)) {
      availableHours.push(hour);
    }
  }

  return availableHours;
}

// Get blacklist reason for a specific hour
export function getHourBlacklistReason(hour: number): string | null {
  const blacklistedTime = BLACKLISTED_TIMES.find((bt) => bt.hour === hour);
  if (blacklistedTime) return blacklistedTime.reason || "Not available";

  const blacklistedRange = BLACKLISTED_TIME_RANGES.find(
    (range) => hour >= range.startHour || hour < range.endHour,
  );
  if (blacklistedRange) return blacklistedRange.reason || "Not available";

  return null;
}

// Get blacklist reason for a specific date
export function getDateBlacklistReason(
  month: number,
  day: number,
): string | null {
  const blacklistedDate = BLACKLISTED_DATES.find(
    (bd) => bd.month === month && bd.day === day,
  );
  return blacklistedDate?.reason || null;
}
