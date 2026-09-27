/**
 * Counts remaining Mon-Fri business days between today and a deadline date
 * string ("YYYY-MM-DD", as produced by <input type="date">). No holiday
 * calendar exists elsewhere in this app, so weekends are the only exclusion.
 *
 * @param {string} deadlineDateString
 * @returns {number|null} negative if the deadline has already passed, null if invalid/empty
 */
export function countRemainingBusinessDays(deadlineDateString) {
  if (!deadlineDateString) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(`${deadlineDateString}T00:00:00`);
  if (Number.isNaN(deadline.getTime())) return null;

  const isPast = deadline < today;
  const start = isPast ? deadline : today;
  const end = isPast ? today : deadline;

  let count = 0;
  const cursor = new Date(start);
  while (cursor < end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return isPast ? -count : count;
}
