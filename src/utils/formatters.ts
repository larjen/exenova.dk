/**
 * @file formatters.ts
 * @description Utility functions for formatting data for display.
 * Centralizes formatting logic to enforce consistency across the codebase.
 */

/**
 * @description Formats a label string into a human-readable format.
 * Replaces hyphens and underscores with spaces.
 * @param {string} str - The string to format (e.g., a tag or path slug).
 * @returns {string} Formatted string with spaces instead of hyphens/underscores.
 */
export function formatLabel(str: string): string {
  return str.replace(/[-_]/g, ' ');
}

/**
 * @description Formats a date string into a human-readable, locale-aware format.
 * Uses Intl.DateTimeFormat for 'en-US' locale with year, month, and day options.
 * If the date string is invalid, returns the original string and logs a warning.
 * This resilient behavior ensures that malformed dates from content do not
 * break page rendering; instead, the raw string is passed through for debugging.
 * @param {string} dateString - The date string to format (e.g., from YAML frontmatter).
 * @returns {string} Formatted date string (e.g., "April 25, 2026") or the original string if invalid.
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(
        `[formatters] Invalid date string received: "${dateString}". Returning original value.`
      );
      return dateString;
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    console.warn(`[formatters] Failed to format date "${dateString}":`, error);
    return dateString;
  }
}
