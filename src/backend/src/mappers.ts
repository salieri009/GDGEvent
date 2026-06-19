import { Pet } from './types.js';

function nullableString(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value);
  return s.length > 0 ? s : null;
}

export function mapPetRow(row: Record<string, unknown>): Pet {
  return {
    id: row.id as string,
    name: row.name as string,
    quote: nullableString(row.quote),
    description: nullableString(row.description),
    imageUrl: nullableString(row.image_url),
    age: nullableString(row.age),
    breed: nullableString(row.breed),
    likes: Array.isArray(row.likes) ? (row.likes as string[]) : [],
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    status: row.status as Pet['status'],
    refId: nullableString(row.ref_id),
  };
}

