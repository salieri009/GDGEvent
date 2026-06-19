import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/client';
import { adoptionErrorMessage } from '@/features/adoption/lib/adoptionErrors';

describe('adoptionErrorMessage', () => {
  it('maps 409 to friendly copy (PRD v1.1)', () => {
    const err = new ApiError(409, JSON.stringify({ error: 'Pet not available for adoption' }));
    expect(adoptionErrorMessage(err)).toContain('scooped up');
  });

  it('maps 429 to friendly copy', () => {
    const err = new ApiError(429, JSON.stringify({ error: 'Too many requests' }));
    expect(adoptionErrorMessage(err)).toContain('Too many applications');
  });
});
