import type { Response } from 'express';
import type { PostgrestError } from '@supabase/supabase-js';

/** Map PostgREST errors to HTTP status + JSON body for clients. */
export function respondSupabaseError(res: Response, error: PostgrestError) {
  const msg = error.message ?? '';

  if (error.code === 'PGRST116') {
    return res.status(404).json({ error: 'Not found' });
  }

  // Table missing or not exposed to PostgREST schema cache (DB never migrated, wrong project, etc.)
  if (
    msg.includes('Could not find the table') ||
    msg.includes('schema cache') ||
    error.code === 'PGRST205'
  ) {
    return res.status(503).json({
      error: 'Supabase has no public.pets (and related tables) for this project.',
      hint: 'Open the Supabase project that matches SUPABASE_URL on Cloud Run, run SQL from src/backend/supabase/schema.sql in the SQL Editor, then retry. Confirm SUPABASE_URL points at that same project.',
      code: error.code,
      details: msg,
    });
  }

  return res.status(500).json({ error: msg, code: error.code });
}
