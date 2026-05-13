import { supabase } from '../lib/supabase';
import { Pet } from '../types';

// --- DB row → Pet type mapper ---
// Supabase returns snake_case; our app uses camelCase.
function mapRow(row: Record<string, unknown>): Pet {
  return {
    id:          row.id as string,
    name:        row.name as string,
    quote:       row.quote as string,
    description: row.description as string,
    imageUrl:    row.image_url as string,
    age:         row.age as string,
    breed:       row.breed as string,
    likes:       (row.likes as string[]) ?? [],
    tags:        (row.tags  as string[]) ?? [],
    status:      row.status as Pet['status'],
    refId:       row.ref_id as string,
  };
}

export const petService = {
  /** Fetch all pets */
  async getAll(): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRow);
  },

  /** Fetch a single pet by id */
  async getById(id: string): Promise<Pet | undefined> {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PostgREST returns PGRST116 when row not found — treat as undefined
      if (error.code === 'PGRST116') return undefined;
      throw new Error(error.message);
    }
    return mapRow(data);
  },
};

// --- Adoption application type ---
export interface AdoptionApplicationPayload {
  petId:         string;
  applicantName: string;
  favoriteSnack: string;
  promiseGiven:  boolean;
}

export const adoptionService = {
  /** Submit a new adoption application */
  async submit(payload: AdoptionApplicationPayload): Promise<void> {
    const { error } = await supabase
      .from('adoption_applications')
      .insert({
        pet_id:         payload.petId,
        applicant_name: payload.applicantName,
        favorite_snack: payload.favoriteSnack,
        promise_given:  payload.promiseGiven,
      });

    if (error) throw new Error(error.message);
  },
};
