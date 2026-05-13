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

app.get('/', (_req, res) => {
  res.redirect('/health');
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/debug/supabase', async (_req, res) => {
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin.from('pets').select('count').limit(1);

    if (error) {
      console.error('Supabase connection test failed:', error);
      return res.status(500).json({
        connected: false,
        error: error.message,
        details: error,
        supabaseUrl: env.SUPABASE_URL ? 'Set' : 'Not set',
        serviceKey: env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
      });
    }

    return res.json({
      connected: true,
      supabaseUrl: env.SUPABASE_URL ? 'Set' : 'Not set',
      serviceKey: env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
    });
  } catch (err) {
    console.error('Unexpected error in supabase debug:', err);
    return res.status(500).json({
      connected: false,
      error: 'Unexpected error',
      details: err instanceof Error ? err.message : 'Unknown error',
      supabaseUrl: env.SUPABASE_URL ? 'Set' : 'Not set',
      serviceKey: env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set'
    });
  }
});

app.get('/api/pets', async (_req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('pets').select('*').order('created_at', { ascending: true });
    if (error) return respondSupabaseError(res, error);
    return res.json((data ?? []).map((row) => mapPetRow(row as unknown as Record<string, unknown>)));
  } catch (err) {
    console.error('Unexpected error in /api/pets:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/pets/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const { data, error } = await supabaseAdmin.from('pets').select('*').eq('id', id).single();
    if (error) return respondSupabaseError(res, error);
    return res.json(mapPetRow(data as unknown as Record<string, unknown>));
  } catch (err) {
    console.error('Unexpected error in /api/pets/:id endpoint', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/adoption-applications', async (req, res) => {
  try {
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
  } catch (err) {
    console.error('Unexpected error in /api/adoption-applications:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${env.PORT}`);
});
