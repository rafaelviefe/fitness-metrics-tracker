import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatIsoToDateTimeLocal } from './date-utils';

describe('formatIsoToDateTimeLocal', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Use fake timers to control Date.now() and new Date() behavior
    vi.useFakeTimers();
    // Set a consistent system time for tests where current time is used
    vi.setSystemTime(new Date('2023-11-15T10:00:00.000Z'));
    // Spy on console.error to check if it's called without printing to console
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore real timers after each test
    vi.useRealTimers();
    // Restore console.error to its original implementation
    consoleErrorSpy.mockRestore();
  });

  it('should correctly format a valid ISO date string to datetime-local format', () => {
    const isoDate = '2023-10-27T14:30:00.000Z';
    // Note: new Date(isoDate) when called without arguments uses local timezone
    // for methods like getFullYear, getMonth etc., which is what formatIsoToDateTimeLocal does.
    // The expected output is based on the system's local timezone interpretation of '2023-10-27T14:30:00.000Z'
    // For consistent test results, the exact expected string might need adjustment or a more robust solution
    // like always using UTC or a specific timezone in tests if timezones were more central.
    // For this simple formatter, it performs calculations based on the Date object's local time components.

    // Manually calculate the expected local time based on the mock date object's interpretation
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(formatIsoToDateTimeLocal(isoDate)).toBe(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle dates at the start of the month/day with leading zeros', () => {
    const isoDate = '2023-01-01T00:00:00.000Z';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(formatIsoToDateTimeLocal(isoDate)).toBe(expected);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should return current system time in datetime-local format for an invalid date string', () => {
    const invalidIsoDate = 'not-a-valid-date-string';
    const now = new Date(); // This will be the faked system time set in beforeEach

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const expectedFallback = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(formatIsoToDateTimeLocal(invalidIsoDate)).toBe(expectedFallback);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatIsoToDateTimeLocal:',
      invalidIsoDate
    );
  });

  it('should return current system time in datetime-local format for an empty date string', () => {
    const emptyDate = '';
    const now = new Date(); // This will be the faked system time set in beforeEach

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const expectedFallback = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(formatIsoToDateTimeLocal(emptyDate)).toBe(expectedFallback);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatIsoToDateTimeLocal:',
      emptyDate
    );
  });

  it('should handle leap year dates correctly', () => {
    const isoDate = '2024-02-29T12:00:00.000Z'; // 2024 is a leap year
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const expected = `${year}-${month}-${day}T${hours}:${minutes}`;

    expect(formatIsoToDateTimeLocal(isoDate)).toBe(expected);
  });
});
