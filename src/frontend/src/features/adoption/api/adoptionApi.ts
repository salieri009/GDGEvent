import { apiFetch } from '@/shared/api/client';

export interface AdoptionApplicationPayload {
  petId: string;
  applicantName: string;
  favoriteSnack: string;
  promiseGiven: boolean;
}

export async function submitAdoptionApplication(payload: AdoptionApplicationPayload): Promise<void> {
  await apiFetch<{ ok: true }>('/api/adoption-applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
