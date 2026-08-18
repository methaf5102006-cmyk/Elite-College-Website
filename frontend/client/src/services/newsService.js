import api from './api';

export const getAllNews = async () => {
  const res = await api.get('/news');
  return res.data.data;
};

export const getNewsBySlug = async (slug) => {
  const res = await api.get(`/news/${slug}`);
  return res.data.data;
};

export const addNews = async (title, category, author, body, file) => {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('author', author);
  formData.append('body', body); // paragraphs separated by newlines
  formData.append('image', file);

  const res = await api.post('/news', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

export const deleteNews = async (id) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};

export const addComment = async (slug, name, email, website, comment) => {
  const res = await api.post(`/news/${slug}/comments`, { name, email, website, comment });
  return res.data.data;
};