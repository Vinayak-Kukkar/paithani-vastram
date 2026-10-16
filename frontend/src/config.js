export const STORE_CONFIG = {
  brandName: 'PAITHANI VASTRAM',
  marathiBrandName: 'पैठणी वस्त्रम',
  phone: '7219120935',
  displayPhone: '+91 72191 20935',
  whatsappNumber: '917219120935',
  email: 'vinuu1124@gmail.com',
  workshopAddress: 'Yeola, Dist. Nashik, Maharashtra - 423401'
};

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '/sarees/1000078648.jpg';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads/')) {
    return API_BASE_URL ? `${API_BASE_URL}${imagePath}` : imagePath;
  }
  return imagePath;
};
