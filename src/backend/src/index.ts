import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { env } from './env.js';
import { supabaseAdmin } from './supabase.js';
import { mapPetRow } from './mappers.js';
import { AdoptionApplicationPayload } from './types.js';
import { respondSupabaseError } from './errors.js';
import { parsePaginationQuery, PET_ID_PATTERN, validateAdoptionPayload } from './validation.js';

const app = express();

app.set('trust proxy', 1);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  entry.count += 1;
  return next();
}

app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: env.CORS_ORIGIN
      ? env.CORS_ORIGIN.split(',').map((s) => s.trim())
      : env.NODE_ENV === 'production'
        ? false
        : true,
  }),
);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/health/ready', async (_req, res) => {
  const { error } = await supabaseAdmin.from('pets').select('id').limit(1);
  if (error) return respondSupabaseError(res, error);
  return res.json({ ok: true });
});

app.get('/api/pets', async (req, res) => {
  const pagination = parsePaginationQuery(req.query.limit, req.query.offset);
  let query = supabaseAdmin.from('pets').select('*').order('created_at', { ascending: true });

  if (pagination) {
    query = query.range(pagination.offset, pagination.offset + pagination.limit - 1);
  }

  const { data, error } = await query;
  if (error) return respondSupabaseError(res, error);
  return res.json((data ?? []).map((row) => mapPetRow(row as unknown as Record<string, unknown>)));
});

app.get('/api/pets/:id', async (req, res) => {
  const id = req.params.id;
  if (!id || !PET_ID_PATTERN.test(id)) return res.status(400).json({ error: 'Invalid payload' });

  const { data, error } = await supabaseAdmin.from('pets').select('*').eq('id', id).single();
  if (error) return respondSupabaseError(res, error);
  return res.json(mapPetRow(data as unknown as Record<string, unknown>));
});

app.post('/api/adoption-applications', rateLimit, async (req, res) => {
  const payload = validateAdoptionPayload(req.body as Partial<AdoptionApplicationPayload>);
  if (!payload) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { error } = await supabaseAdmin.rpc('submit_adoption_application', {
    p_pet_id: payload.petId,
    p_applicant_name: payload.applicantName,
    p_favorite_snack: payload.favoriteSnack,
    p_promise_given: payload.promiseGiven,
  });

  if (error) {
    const msg = error.message ?? '';
    if (msg.includes('pet_not_found')) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (msg.includes('pet_not_available')) {
      return res.status(409).json({ error: 'Pet not available for adoption' });
    }
    if (msg.includes('invalid_payload')) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    // Fallback when v2 RPC not migrated — legacy path
    if (msg.includes('Could not find the function') || error.code === 'PGRST202') {
      const { data: pet, error: petError } = await supabaseAdmin
        .from('pets')
        .select('id, status')
        .eq('id', payload.petId)
        .single();

      if (petError) return respondSupabaseError(res, petError);
      if (pet.status !== 'available') {
        return res.status(409).json({ error: 'Pet not available for adoption' });
      }

      const { error: insertError } = await supabaseAdmin.from('adoption_applications').insert({
        pet_id: payload.petId,
        applicant_name: payload.applicantName,
        favorite_snack: payload.favoriteSnack,
        promise_given: payload.promiseGiven,
      });

      if (insertError) return respondSupabaseError(res, insertError);
      return res.status(201).json({ ok: true });
    }
    return respondSupabaseError(res, error);
  }

  return res.status(201).json({ ok: true });
});

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on :${env.PORT}`);
});
