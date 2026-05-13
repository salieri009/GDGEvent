import cors from 'cors';
import express from 'express';
import { env } from './env.js';
import { supabaseAdmin } from './supabase.js';
import { mapPetRow } from './mappers.js';
import { AdoptionApplicationPayload } from './types.js';
import { respondSupabaseError } from './errors.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(',').map((s) => s.trim()) : true,
  })
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/pets', async (_req, res) => {
  const { data, error } = await supabaseAdmin.from('pets').select('*').order('created_at', { ascending: true });
  if (error) return respondSupabaseError(res, error);
  return res.json((data ?? []).map((row) => mapPetRow(row as unknown as Record<string, unknown>)));
});

app.get('/api/pets/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const { data, error } = await supabaseAdmin.from('pets').select('*').eq('id', id).single();
  if (error) return respondSupabaseError(res, error);
  return res.json(mapPetRow(data as unknown as Record<string, unknown>));
});

app.post('/api/adoption-applications', async (req, res) => {
  const body = req.body as Partial<AdoptionApplicationPayload>;
  if (!body?.petId || !body.applicantName || !body.favoriteSnack || body.promiseGiven !== true) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { error } = await supabaseAdmin.from('adoption_applications').insert({
    pet_id: body.petId,
    applicant_name: body.applicantName,
    favorite_snack: body.favoriteSnack,
    promise_given: body.promiseGiven,
  });

  if (error) return respondSupabaseError(res, error);
  return res.status(201).json({ ok: true });
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${env.PORT}`);
});
