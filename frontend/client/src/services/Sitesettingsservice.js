import api from './api';

export const getSiteSettings = async () => {
  const res = await api.get('/settings');
  return res.data.data;
};

export const updateSiteSettings = async (data) => {
  const res = await api.put('/settings', data);
  return res.data.data;
};