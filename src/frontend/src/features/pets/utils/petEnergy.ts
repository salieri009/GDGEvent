import type { Pet } from '@/shared/types/pet';

/** Energy score 0–100 derived from seed tags/likes — not decorative. */
const TAG_ENERGY: Record<string, number> = {
  'very wiggly': 88,
  'expert napper': 18,
  gentle: 38,
  chaos: 92,
  fluffy: 55,
};

const LIKE_ENERGY: Record<string, number> = {
  zoomies: 90,
  mud: 72,
  shoes: 68,
  air: 75,
  dirt: 70,
  socks: 65,
  naptime: 12,
  crackers: 40,
  'soft blankets': 15,
  feet: 25,
  vacuums: 50,
  'quiet moments': 10,
};

function stableIdEnergy(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % 41;
  }
  return 35 + hash;
}

export function petEnergyPercent(pet: Pick<Pet, 'id' | 'tags' | 'likes'>): number {
  const scores: number[] = [];

  for (const tag of pet.tags) {
    const value = TAG_ENERGY[tag.toLowerCase()];
    if (value !== undefined) scores.push(value);
  }

  for (const like of pet.likes) {
    const value = LIKE_ENERGY[like.toLowerCase()];
    if (value !== undefined) scores.push(value);
  }

  if (scores.length === 0) return stableIdEnergy(pet.id);
  return Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length);
}

export function petEnergyLabel(percent: number): string {
  if (percent >= 70) return 'High energy';
  if (percent >= 45) return 'Balanced';
  return 'Chill vibes';
}
