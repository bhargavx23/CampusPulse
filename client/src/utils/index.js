/**
 * CampusPulse Design System Utilities
 */

/**
 * Combines class names conditionally.
 *
 * @param  {...any} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format string to title case.
 *
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase(str) {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
