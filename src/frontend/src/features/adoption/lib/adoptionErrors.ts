import { ApiError, apiErrorMessage } from '@/shared/api/client';

const ADOPTION_ERROR_COPY: Record<number, string> = {
  400: 'Please check your answers — all fields are required and the sacred vow must be checked.',
  409: 'Sorry — this pup was just scooped up by someone else. Head back to the pack and pick another friend!',
  429: 'Whoa there! Too many applications at once. Take a breath and try again in a minute.',
};

export function adoptionErrorMessage(err: unknown, fallback = 'Failed to submit'): string {
  if (err instanceof ApiError && ADOPTION_ERROR_COPY[err.status]) {
    return ADOPTION_ERROR_COPY[err.status];
  }
  return apiErrorMessage(err, fallback);
}
