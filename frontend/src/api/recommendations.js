import { recommendationClient } from './client';

export const generateRecommendation = (data) =>
  recommendationClient.post('/recommendations/generate', data);
