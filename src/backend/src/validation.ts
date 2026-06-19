import type { AdoptionApplicationPayload } from './types.js';

export const MAX_FIELD_LEN = 200;
export const PET_ID_PATTERN = /^[a-z0-9-]+$/;

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
