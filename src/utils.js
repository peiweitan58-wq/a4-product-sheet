export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;
export const MAX_IMAGES = 6;

export function getGridConfig(imageCount) {
  if (imageCount <= 1) {
    return 'grid-cols-1';
  }

  if (imageCount === 2) {
    return 'grid-cols-2';
  }

  if (imageCount <= 4) {
    return 'grid-cols-2';
  }

  return 'grid-cols-3';
}

export function getGridRows(imageCount) {
  if (imageCount <= 2) {
    return '';
  }

  if (imageCount <= 4) {
    return 'grid-rows-2';
  }

  return 'grid-rows-2';
}

export function formatExportDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`;
}

export function sanitizeFileSegment(value) {
  return (value || 'Product_Sheet')
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'Product_Sheet';
}
