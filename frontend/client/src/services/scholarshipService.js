import api from './api';

export const getScholarships = async (all = false) => {
  const res = await api.get('/scholarships', { params: all ? { all: true } : {} });
  return res.data.data;
};

export const createScholarship = async (payload) => {
  const res = await api.post('/scholarships', payload);
  return res.data.data;
};

export const updateScholarship = async (id, payload) => {
  const res = await api.put(`/scholarships/${id}`, payload);
  return res.data.data;
};

export const deleteScholarship = async (id) => {
  const res = await api.delete(`/scholarships/${id}`);
  return res.data;
};