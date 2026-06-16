import { useMutation } from '@tanstack/react-query';
import { generateRecommendation } from '../api/recommendations';

export function useGenerateRecommendation() {
  return useMutation({
    mutationFn: (data) => generateRecommendation(data),
  });
}
