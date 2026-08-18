import api from './api';

export const getFaculty = async (departmentId = '') => {
  const res = await api.get('/faculty', {
    params: departmentId ? { department: departmentId } : {}
  });
  return res.data.data;
};

export const getDepartmentsForFilter = async () => {
  const res = await api.get('/departments');
  return res.data.data;
};

export const createFacultyMember = async (name, designation, qualification, department, email, bio, file) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('designation', designation);
  formData.append('qualification', qualification);
  formData.append('department', department);
  formData.append('email', email);
  formData.append('bio', bio);
  if (file) formData.append('image', file);

  const res = await api.post('/faculty', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

export const updateFacultyMember = async (id, name, designation, qualification, department, email, bio, file) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('designation', designation);
  formData.append('qualification', qualification);
  formData.append('department', department);
  formData.append('email', email);
  formData.append('bio', bio);
  if (file) formData.append('image', file);

  const res = await api.put(`/faculty/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

export const deleteFacultyMember = async (id) => {
  const res = await api.delete(`/faculty/${id}`);
  return res.data;
};