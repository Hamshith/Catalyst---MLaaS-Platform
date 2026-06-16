import { datasetClient } from './client';

export const createTrainingRequest = (data) =>
  datasetClient.post('/requests/', data);

export const getRequests = () => datasetClient.get('/requests/');

export const getRequest = (id) => datasetClient.get(`/requests/${id}`);
