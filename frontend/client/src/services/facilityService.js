import api from './api';

export const getFacilities = async () => {
  const res = await api.get('/facilities');
  return res.data.data;
};

export const createFacility = async (data) => {
  const res = await api.post('/facilities', data);
  return res.data.data;
};

export const updateFacility = async (id, data) => {
  const res = await api.put(`/facilities/${id}`, data);
  return res.data.data;
};

export const deleteFacility = async (id) => {
  const res = await api.delete(`/facilities/${id}`);
  return res.data;
};