import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listEvents, createEvent, updateEvent, deleteEvent } from '../api/rest';

export function useEvents(filters: Parameters<typeof listEvents>[0]) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['events', filters],
    queryFn: () => listEvents(filters),
    staleTime: 30_000,
    retry: 3,
    refetchOnReconnect: true,
  });

  const createMut = useMutation({
    mutationFn: createEvent,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    retry: 3,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: Parameters<typeof updateEvent>[1] }) =>
      updateEvent(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    retry: 3,
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
    retry: 3,
  });

  return { query, createMut, updateMut, deleteMut };
}
