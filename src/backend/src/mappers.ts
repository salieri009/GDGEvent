import { Pet } from './types.js';

export function mapPetRow(row: Record<string, unknown>): Pet {
  return {
    id: row.id as string,
    name: row.name as string,
    quote: (row.quote as string) ?? '',
    description: (row.description as string) ?? '',
    imageUrl: (row.image_url as string) ?? '',
    age: (row.age as string) ?? '',
    breed: (row.breed as string) ?? '',
    likes: (row.likes as string[]) ?? [],
    tags: (row.tags as string[]) ?? [],
    status: row.status as Pet['status'],
    refId: (row.ref_id as string) ?? '',
  };
}

