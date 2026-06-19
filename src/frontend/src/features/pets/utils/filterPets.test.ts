import { describe, expect, it } from 'vitest';
import type { Pet } from '@/shared/types/pet';
import { filterPets, countAvailable, pickFeaturedPet } from '@/features/pets/utils/filterPets';

const sample: Pet[] = [
  {
    id: 'a',
    name: 'Alpha',
    quote: null,
    description: null,
    imageUrl: null,
    age: null,
    breed: null,
    likes: [],
    tags: ['Very Wiggly', 'Gentle'],
    status: 'available',
    refId: null,
  },
  {
    id: 'b',
    name: 'Beta',
    quote: null,
    description: null,
    imageUrl: null,
    age: null,
    breed: null,
    likes: [],
    tags: ['Expert Napper'],
    status: 'pending',
    refId: null,
  },
];

describe('filterPets', () => {
  it('OR semantics among tag pills (FR-1.5)', () => {
    const result = filterPets(sample, '', ['Very Wiggly', 'Expert Napper']);
    expect(result.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('AND semantics with search (FR-1.4)', () => {
    const result = filterPets(sample, 'alpha', ['Gentle']);
    expect(result.map((p) => p.id)).toEqual(['a']);
  });
});

describe('countAvailable / pickFeaturedPet', () => {
  it('counts available pets only', () => {
    expect(countAvailable(sample)).toBe(1);
  });

  it('prefers first available for featured', () => {
    expect(pickFeaturedPet(sample)?.id).toBe('a');
  });
});
