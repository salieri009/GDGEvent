import type { AdoptionApplicationPayload, ReviewAction } from './types.js';

export const MAX_FIELD_LEN = 200;
export const PET_ID_PATTERN = /^[a-z0-9-]+$/;
export const PET_STATUS_VALUES = ['available', 'pending', 'adopted'] as const;
export const APPLICATION_STATUS_VALUES = ['pending', 'approved', 'rejected'] as const;
export const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateAdoptionPayload(body: Partial<AdoptionApplicationPayload>): AdoptionApplicationPayload | null {
  if (!body?.petId || !body.applicantName || !body.favoriteSnack || body.promiseGiven !== true) {
    return null;
  }

  const petId = String(body.petId).trim();
  const applicantName = String(body.applicantName).trim();
  const favoriteSnack = String(body.favoriteSnack).trim();

  if (!PET_ID_PATTERN.test(petId)) return null;
  if (!applicantName || applicantName.length > MAX_FIELD_LEN) return null;
  if (!favoriteSnack || favoriteSnack.length > MAX_FIELD_LEN) return null;

  return { petId, applicantName, favoriteSnack, promiseGiven: true };
}

export function parsePaginationQuery(rawLimit: unknown, rawOffset: unknown): { limit: number; offset: number } | null {
  if (rawLimit === undefined) return null;
  const limit = Math.min(Math.max(parseInt(String(rawLimit), 10) || 0, 1), 100);
  const offset = Math.max(parseInt(String(rawOffset ?? '0'), 10) || 0, 0);
  return { limit, offset };
}

export interface PetListFilters {
  status?: (typeof PET_STATUS_VALUES)[number];
  tag?: string;
  q?: string;
}

export function parsePetListFilters(query: Record<string, unknown>): PetListFilters {
  const filters: PetListFilters = {};

  if (typeof query.status === 'string' && PET_STATUS_VALUES.includes(query.status as never)) {
    filters.status = query.status as PetListFilters['status'];
  }

  if (typeof query.tag === 'string' && query.tag.trim()) {
    filters.tag = query.tag.trim();
  }

  if (typeof query.q === 'string' && query.q.trim()) {
    filters.q = query.q.trim();
  }

  return filters;
}

export function petMatchesSearch(
  row: { name?: unknown; tags?: unknown },
  q: string,
): boolean {
  const needle = q.toLowerCase();
  const name = String(row.name ?? '').toLowerCase();
  if (name.includes(needle)) return true;
  const tags = Array.isArray(row.tags) ? (row.tags as string[]) : [];
  return tags.some((t) => t.toLowerCase().includes(needle));
}

export function validateReviewAction(body: unknown): ReviewAction | null {
  if (!body || typeof body !== 'object') return null;
  const action = (body as { action?: unknown }).action;
  if (action === 'approve' || action === 'reject') return action;
  return null;
}

export function validateAdminLogin(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const apiKey = (body as { apiKey?: unknown }).apiKey;
  if (typeof apiKey !== 'string' || !apiKey.trim()) return null;
  return apiKey.trim();
}
