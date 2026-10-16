export const STORE_CONFIG = {
  brandName: 'PAITHANI VASTRAM',
  marathiBrandName: 'पैठणी वस्त्रम',
  phone: '7219120935',
  displayPhone: '+91 72191 20935',
  whatsappNumber: '917219120935',
  email: 'vinuu1124@gmail.com',
  workshopAddress: 'Yeola, Dist. Nashik, Maharashtra - 423401'
};

// API Base URL resolution:
// - In local dev (Vite proxy): VITE_API_URL can be omitted, defaults to '' (proxied to localhost:5000)
// - On Vercel: Set VITE_API_URL=https://your-backend.onrender.com
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Builds full API endpoint URL
 * @param {string} endpoint e.g. '/api/sarees' or 'api/orders'
 */
export const apiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
};

/**
 * Resolves image paths across:
 * 1. External URLs (http/https/data)
 * 2. Uploaded backend assets (/uploads/...) -> prepends API_BASE_URL on production
 * 3. Static frontend assets (/sarees/...) -> served directly from Vercel public/
 */
export const resolveImageUrl = (img) => {
  if (!img) return '/sarees/1000078648.jpg';
  if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:')) {
    return img;
  }
  if (img.startsWith('/uploads/')) {
    return API_BASE_URL ? `${API_BASE_URL}${img}` : img;
  }
  return img;
};
