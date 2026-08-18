import api from './api';

export const getEvents = async (filter = '') => {
  const res = await api.get('/events', {
    params: filter ? { filter } : {}
  });
  return res.data.data;
};

export const getAllEventsForAdmin = async () => {
  const res = await api.get('/events');
  return res.data.data;
};

/**
 * files: array of File objects (new images to upload)
 */
export const createEvent = async (title, description, eventDate, location, files = []) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('eventDate', eventDate);
  formData.append('location', location);
  files.forEach((file) => formData.append('images', file));

  const res = await api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

/**
 * files: array of File objects (new images to upload)
 * existingImages: array of image URLs the admin chose to keep (for edits)
 */
export const updateEvent = async (id, title, description, eventDate, location, files = [], existingImages = []) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  formData.append('eventDate', eventDate);
  formData.append('location', location);
  formData.append('existingImages', JSON.stringify(existingImages));
  files.forEach((file) => formData.append('images', file));

  const res = await api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};