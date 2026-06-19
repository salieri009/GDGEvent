import type { Pet } from '@/shared/types/pet';

export function filterPets(pets: Pet[], search: string, activeTags: string[]): Pet[] {
  const q = search.toLowerCase();
  return pets.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    const matchesTags =
      activeTags.length === 0 ||
      activeTags.some((tag) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    return matchesSearch && matchesTags;
  });
}

export function countAvailable(pets: Pet[]): number {
  return pets.filter((p) => p.status === 'available').length;
}

export function pickFeaturedPet(pets: Pet[]): Pet | undefined {
  return pets.find((p) => p.status === 'available') ?? pets[0];
}
