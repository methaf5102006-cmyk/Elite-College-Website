import api from './api';

export const getShortCourses = async () => {
  const res = await api.get('/short-courses');
  return res.data.data;
};

export const createShortCourse = async (data) => {
  const res = await api.post('/short-courses', data);
  return res.data.data;
};

export const updateShortCourse = async (id, data) => {
  const res = await api.put(`/short-courses/${id}`, data);
  return res.data.data;
};

export const deleteShortCourse = async (id) => {
  const res = await api.delete(`/short-courses/${id}`);
  return res.data;
};