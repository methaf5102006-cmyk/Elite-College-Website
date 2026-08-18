import api from './api';

export const requestPasswordReset = async (email) => {
  const res = await api.post('/admin-setup/forgot-password', { email });
  return res.data;
};

export const resetPassword = async (email, otp, newPassword) => {
  const res = await api.post('/admin-setup/reset-password', { email, otp, newPassword });
  return res.data;
};