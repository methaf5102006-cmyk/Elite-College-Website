import api from './api';

export const getActivityLogs = async () => {
  const res = await api.get('/activity-logs');
  return res.data.data;
};