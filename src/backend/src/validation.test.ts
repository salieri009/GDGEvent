import { describe, expect, it } from 'vitest';
import { parsePaginationQuery, validateAdoptionPayload } from './validation.js';

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
