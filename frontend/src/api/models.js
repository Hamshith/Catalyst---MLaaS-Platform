import { modelClient } from './client';

export const getModels = () => modelClient.get('/models');

export const getModel = (id) => modelClient.get(`/models/${id}`);

export const downloadModel = async (id) => {
  const response = await modelClient.get(`/models/${id}/download`, {
    responseType: 'blob',
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${id}.joblib`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
