import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatasets, getDataset, uploadDataset, deleteDataset } from '../api/datasets';
import toast from 'react-hot-toast';

export function useDatasets() {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => getDatasets().then((r) => r.data),
  });
}

export function useDataset(id) {
  return useQuery({
    queryKey: ['dataset', id],
    queryFn: () => getDataset(id).then((r) => r.data),
    enabled: !!id,
  });
}

export function useUploadDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => uploadDataset(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset uploaded successfully');
    },
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDataset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset deleted');
    },
  });
}
