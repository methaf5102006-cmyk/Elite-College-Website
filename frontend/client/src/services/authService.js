import api from './api';

export const loginAdmin = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data.data;
};

export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.data;
};

export const initiateCreateManager = async (formData) => {
  const res = await api.post('/auth/create-manager/initiate', formData);
  return res.data;
};

export const verifyManagerOtp = async (email, otp) => {
  const res = await api.post('/auth/create-manager/verify', { email, otp });
  return res.data;
};

export const getManagers = async () => {
  const res = await api.get('/auth/managers');
  return res.data.data;
};

export const updateManager = async (id, data) => {
  const res = await api.put(`/auth/managers/${id}`, data);
  return res.data;
};

export const changeManagerPassword = async (id, newPassword) => {
  const res = await api.put(`/auth/managers/${id}/password`, { newPassword });
  return res.data;
};

export const deleteManager = async (id) => {
  const res = await api.delete(`/auth/managers/${id}`);
  return res.data;
};