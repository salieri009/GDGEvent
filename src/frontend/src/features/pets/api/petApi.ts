import { ApiError, apiFetch } from '@/shared/api/client';
import type { Pet } from '@/shared/types/pet';

export const petApi = {
  async getAll(): Promise<Pet[]> {
    return apiFetch<Pet[]>('/api/pets');
  },

  async getById(id: string): Promise<Pet | undefined> {
    try {
      return await apiFetch<Pet>(`/api/pets/${encodeURIComponent(id)}`);
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) return undefined;
      throw e;
    }
  },
};
