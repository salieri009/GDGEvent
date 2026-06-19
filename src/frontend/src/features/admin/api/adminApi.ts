import { apiFetch } from '@/shared/api/client';
import type { AdoptionApplication, ReviewAction } from '@/shared/types/application';
import { clearAdminKey, getAdminKey, setAdminKey } from '../lib/adminAuth';

function adminHeaders(): HeadersInit {
  const key = getAdminKey();
  return key ? { 'X-Admin-Key': key } : {};
}

export async function adminLogin(apiKey: string): Promise<void> {
  await apiFetch<{ ok: true }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ apiKey }),
  });
  setAdminKey(apiKey);
}

export function adminLogout(): void {
  clearAdminKey();
}

export async function listApplications(
  status: AdoptionApplication['status'] = 'pending',
): Promise<AdoptionApplication[]> {
  return apiFetch<AdoptionApplication[]>(`/api/admin/applications?status=${status}`, {
    headers: adminHeaders(),
  });
}

export async function reviewApplication(id: string, action: ReviewAction): Promise<void> {
  await apiFetch<{ ok: true; action: ReviewAction }>(`/api/admin/applications/${id}/review`, {
    method: 'POST',
    body: JSON.stringify({ action }),
    headers: adminHeaders(),
  });
}
