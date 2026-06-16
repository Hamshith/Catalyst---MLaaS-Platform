import { datasetClient } from './client';

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return datasetClient.post('/datasets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDatasets = () => datasetClient.get('/datasets/');

export const getDataset = (id) => datasetClient.get(`/datasets/${id}`);

export const deleteDataset = (id) => datasetClient.delete(`/datasets/${id}`);
