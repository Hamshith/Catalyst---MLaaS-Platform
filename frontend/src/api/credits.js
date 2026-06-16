import { creditClient } from './client';

export const getCreditBalance = () => creditClient.get('/credits/balance');

export const validateCredits = (modelType) =>
  creditClient.post('/credits/validate', { model_type: modelType });

export const getCreditHistory = () => creditClient.get('/credits/history');
