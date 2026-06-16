import { useQuery } from '@tanstack/react-query';
import { getModels, getModel } from '../api/models';

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: () => getModels().then((r) => r.data),
  });
}

export function useModel(id) {
  return useQuery({
    queryKey: ['model', id],
    queryFn: () => getModel(id).then((r) => r.data),
    enabled: !!id,
  });
}
