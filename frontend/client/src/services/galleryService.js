import api from './api';

export const getGalleryImages = async (category = '') => {
  const res = await api.get('/gallery', {
    params: category ? { category } : {}
  });
  return res.data.data;
};

export const addGalleryImage = async (title, category, file) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', file);

  const res = await api.post('/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

export const deleteGalleryImage = async (id) => {
  const res = await api.delete(`/gallery/${id}`);
  return res.data;
};