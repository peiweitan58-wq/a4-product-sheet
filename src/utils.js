export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const MAX_IMAGES = 4;

export function formatExportDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}

export function formatDisplayDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function sanitizeFileSegment(value, fallback = 'Sales_Return') {
  return (
    (value || fallback)
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 80) || fallback
  );
}
