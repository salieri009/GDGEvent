import { Pet } from '../types';

// Use absolute URL for production, relative for development
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 
  (import.meta.env.PROD ? 'https://api-370881726058.asia-northeast3.run.app' : '');

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const petService = {
  /** Fetch all pets */
  async getAll(): Promise<Pet[]> {
    return apiFetch<Pet[]>('/api/pets');
  },

  /** Fetch a single pet by id */
  async getById(id: string): Promise<Pet | undefined> {
    try {
      return await apiFetch<Pet>(`/api/pets/${encodeURIComponent(id)}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('404')) return undefined;
      throw e;
    }
  },
};

// --- Adoption application type ---
export interface AdoptionApplicationPayload {
  petId:         string;
  applicantName: string;
  favoriteSnack: string;
  promiseGiven:  boolean;
}

export const adoptionService = {
  /** Submit a new adoption application */
  async submit(payload: AdoptionApplicationPayload): Promise<void> {
    await apiFetch<{ ok: true }>('/api/adoption-applications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
