import api from './api';

export const getAbout = async () => {
  const res = await api.get('/about');
  return res.data.data;
};

export const updateAbout = async (data) => {
  const res = await api.put('/about', data);
  return res.data.data;
};