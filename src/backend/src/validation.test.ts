import { describe, expect, it } from 'vitest';
import { parsePaginationQuery, petMatchesSearch, parsePetListFilters, validateAdoptionPayload, validateReviewAction } from './validation.js';

describe('validateAdoptionPayload', () => {
  it('accepts valid payload', () => {
    expect(
      validateAdoptionPayload({
        petId: 'buster',
        applicantName: 'Jane',
        favoriteSnack: 'Bacon',
        promiseGiven: true,
      }),
    ).toEqual({
      petId: 'buster',
      applicantName: 'Jane',
      favoriteSnack: 'Bacon',
      promiseGiven: true,
    });
  });

  it('rejects missing promiseGiven', () => {
    expect(
      validateAdoptionPayload({
        petId: 'buster',
        applicantName: 'Jane',
        favoriteSnack: 'Bacon',
        promiseGiven: false,
      }),
    ).toBeNull();
  });

  it('rejects invalid pet id', () => {
    expect(
      validateAdoptionPayload({
        petId: 'INVALID',
        applicantName: 'Jane',
        favoriteSnack: 'Bacon',
        promiseGiven: true,
      }),
    ).toBeNull();
  });
});

describe('parsePaginationQuery', () => {
  it('returns null when limit omitted', () => {
    expect(parsePaginationQuery(undefined, '0')).toBeNull();
  });

  it('clamps limit to 100', () => {
    expect(parsePaginationQuery('500', '0')).toEqual({ limit: 100, offset: 0 });
  });
});

describe('parsePetListFilters', () => {
  it('parses status tag and q', () => {
    expect(parsePetListFilters({ status: 'available', tag: 'Gentle', q: 'luna' })).toEqual({
      status: 'available',
      tag: 'Gentle',
      q: 'luna',
    });
  });

  it('ignores invalid status', () => {
    expect(parsePetListFilters({ status: 'bogus' })).toEqual({});
  });
});

describe('petMatchesSearch', () => {
  it('matches name and tags', () => {
    expect(petMatchesSearch({ name: 'Luna', tags: ['Expert Napper'] }, 'napper')).toBe(true);
    expect(petMatchesSearch({ name: 'Cloud', tags: [] }, 'dog')).toBe(false);
  });
});

describe('validateReviewAction', () => {
  it('accepts approve and reject', () => {
    expect(validateReviewAction({ action: 'approve' })).toBe('approve');
    expect(validateReviewAction({ action: 'reject' })).toBe('reject');
  });

  it('rejects invalid action', () => {
    expect(validateReviewAction({ action: 'maybe' })).toBeNull();
  });
});
