import api from './api';

export const submitContactQuery = async (formData) => {
  const res = await api.post('/contact', formData);
  return res.data.data;
};

export const getContactQueries = async () => {
  const res = await api.get('/contact');
  return res.data.data;
};

export const updateContactQueryStatus = async (id, status) => {
  const res = await api.put(`/contact/${id}`, { status });
  return res.data.data;
};