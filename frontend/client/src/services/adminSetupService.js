import api from './api';

export const checkSetupStatus = async () => {
  const res = await api.get('/admin-setup/status');
  return res.data.setupDone;
};

export const requestOtp = async (name, email, password) => {
  const res = await api.post('/admin-setup/request-otp', { name, email, password });
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await api.post('/admin-setup/verify-otp', { email, otp });
  return res.data.data;
};

export const requestChangeOtp = async (currentPassword, name, newEmail, newPassword) => {
  const res = await api.post('/admin-setup/request-change', { currentPassword, name, newEmail, newPassword });
  return res.data;
};

export const verifyChangeOtp = async (newEmail, otp) => {
  const res = await api.post('/admin-setup/verify-change', { newEmail, otp });
  return res.data.data;
};