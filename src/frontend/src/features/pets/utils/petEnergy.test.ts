import { describe, expect, it } from 'vitest';
import { petEnergyLabel, petEnergyPercent } from './petEnergy';

describe('petEnergyPercent', () => {
  it('scores Very Wiggly tags high', () => {
    expect(
      petEnergyPercent({ id: 'buster', tags: ['Very Wiggly'], likes: ['Shoes'] }),
    ).toBeGreaterThanOrEqual(70);
  });

  it('scores Expert Napper tags low', () => {
    expect(
      petEnergyPercent({ id: 'luna', tags: ['Expert Napper'], likes: ['Naptime'] }),
    ).toBeLessThan(30);
  });

  it('is stable for the same pet id without tag signals', () => {
    const a = petEnergyPercent({ id: 'cloud', tags: ['Chaos'], likes: ['Zoomies'] });
    const b = petEnergyPercent({ id: 'cloud', tags: ['Chaos'], likes: ['Zoomies'] });
    expect(a).toBe(b);
  });
});

describe('petEnergyLabel', () => {
  it('maps percent to readable label', () => {
    expect(petEnergyLabel(85)).toBe('High energy');
    expect(petEnergyLabel(50)).toBe('Balanced');
    expect(petEnergyLabel(20)).toBe('Chill vibes');
  });
});
