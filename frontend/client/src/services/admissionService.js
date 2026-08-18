import api from './api';

export const submitAdmission = async (fullName, email, phone, program, message) => {
  const res = await api.post('/admissions', { fullName, email, phone, program, message });
  return res.data;
};

export const getAdmissions = async () => {
  const res = await api.get('/admissions');
  return res.data.data;
};

export const checkAdmissionStatus = async (email) => {
  const res = await api.get('/admissions/check-status', { params: { email } });
  return res.data.data;
};

export const updateAdmissionStatus = async (id, status) => {
  const res = await api.put(`/admissions/${id}`, { status });
  return res.data.data;
};

export const deleteAdmission = async (id) => {
  const res = await api.delete(`/admissions/${id}`);
  return res.data;
};