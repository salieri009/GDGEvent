import { describe, expect, it } from 'vitest';
import { isPetAvailable, statusLabel } from '@/shared/lib/petStatus';
import type { Pet } from '@/shared/types/pet';

const pet: Pet = {
  id: 'x',
  name: 'X',
  quote: null,
  description: null,
  imageUrl: null,
  age: null,
  breed: null,
  likes: [],
  tags: [],
  status: 'available',
  refId: null,
};

describe('petStatus', () => {
  it('labels available status', () => {
    expect(statusLabel('available')).toBe('Available!');
  });

  it('detects adoptable pets', () => {
    expect(isPetAvailable(pet)).toBe(true);
    expect(isPetAvailable({ ...pet, status: 'adopted' })).toBe(false);
  });
});
