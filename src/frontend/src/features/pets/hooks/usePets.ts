import { useCallback } from 'react';
import type { Pet } from '@/shared/types/pet';
import { useAsyncResource } from '@/shared/hooks/useAsyncResource';
import { petApi } from '../api/petApi';

export function usePets() {
  const load = useCallback((): Promise<Pet[]> => petApi.getAll(), []);
  return useAsyncResource<Pet[]>({ load, fallbackError: 'Failed to load pets' });
}

export function usePet(id: string | undefined) {
  const load = useCallback(async (): Promise<Pet | null> => {
    if (!id) return null;
    return (await petApi.getById(id)) ?? null;
  }, [id]);

  return useAsyncResource<Pet | null>({
    load,
    enabled: Boolean(id),
    fallbackError: 'Failed to load pet',
  });
}
