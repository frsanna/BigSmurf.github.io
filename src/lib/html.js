// Small HTML helpers shared by sections, SEO and PDF templates.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes text for safe use in HTML content and attributes. */
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

/** Joins an array of HTML fragments, skipping empty values. */
function join(parts, separator = '') {
  return parts.filter(Boolean).join(separator);
}

/** Splits a date range into accessible <time>-friendly markup. */
function dateRange(start, end) {
  return `${esc(start)} – ${esc(end)}`;
}

module.exports = { esc, join, dateRange };
