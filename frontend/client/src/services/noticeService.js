import api from './api';

export const getNotices = async (limit) => {
  const res = await api.get('/notices', {
    params: limit ? { limit } : {}
  });
  return res.data.data;
};

export const getAllNoticesForAdmin = async () => {
  const res = await api.get('/notices');
  return res.data.data;
};

export const createNotice = async (title, description, date, isActive) => {
  const res = await api.post('/notices', { title, description, date, isActive });
  return res.data.data;
};

export const updateNotice = async (id, title, description, date, isActive) => {
  const res = await api.put(`/notices/${id}`, { title, description, date, isActive });
  return res.data.data;
};

export const deleteNotice = async (id) => {
  const res = await api.delete(`/notices/${id}`);
  return res.data;
};