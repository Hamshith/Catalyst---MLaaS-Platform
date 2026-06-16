import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequests, getRequest, createTrainingRequest } from '../api/requests';

export function useRequests() {
  return useQuery({
    queryKey: ['requests'],
    queryFn: () => getRequests().then((r) => r.data),
  });
}

export function useRequest(id) {
  return useQuery({
    queryKey: ['request', id],
    queryFn: () => getRequest(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createTrainingRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });
}
