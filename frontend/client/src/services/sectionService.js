import api from './api';

export const getSections = async (all = false) => {
  const res = await api.get('/sections', { params: all ? { all: true } : {} });
  return res.data.data;
};

export const createSection = async (data) => {
  const res = await api.post('/sections', data);
  return res.data.data;
};

export const updateSection = async (id, data) => {
  const res = await api.put(`/sections/${id}`, data);
  return res.data.data;
};

export const deleteSection = async (id) => {
  const res = await api.delete(`/sections/${id}`);
  return res.data;
};

export const reorderSections = async (orderedIds) => {
  const res = await api.put('/sections/reorder', { orderedIds });
  return res.data.data;
};