import { Router } from 'express';
import { env } from './env.js';
import { supabaseAdmin } from './supabase.js';
import { mapApplicationRow } from './mappers.js';
import { respondSupabaseError } from './errors.js';
import { requireAdmin } from './middleware/adminAuth.js';
import {
  APPLICATION_STATUS_VALUES,
  UUID_PATTERN,
  validateAdminLogin,
  validateReviewAction,
} from './validation.js';

export const adminRouter = Router();

adminRouter.post('/login', (req, res) => {
  if (!env.ADMIN_API_KEY) {
    return res.status(503).json({ error: 'Admin API not configured' });
  }

  const apiKey = validateAdminLogin(req.body);
  if (!apiKey || apiKey !== env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({ ok: true });
});

adminRouter.use(requireAdmin);

adminRouter.get('/applications', async (req, res) => {
  const status =
    typeof req.query.status === 'string' &&
    APPLICATION_STATUS_VALUES.includes(req.query.status as (typeof APPLICATION_STATUS_VALUES)[number])
      ? req.query.status
      : 'pending';

  const { data, error } = await supabaseAdmin
    .from('adoption_applications')
    .select('*, pets(name)')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) return respondSupabaseError(res, error);

  return res.json(
    (data ?? []).map((row) =>
      mapApplicationRow(row as unknown as Record<string, unknown>),
    ),
  );
});

adminRouter.post('/applications/:id/review', async (req, res) => {
  const id = req.params.id;
  if (!id || !UUID_PATTERN.test(id)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const action = validateReviewAction(req.body);
  if (!action) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const { error } = await supabaseAdmin.rpc('review_adoption_application', {
    p_application_id: id,
    p_action: action,
  });

  if (error) {
    const msg = error.message ?? '';
    if (msg.includes('application_not_found')) {
      return res.status(404).json({ error: 'Not found' });
    }
    if (msg.includes('application_not_pending')) {
      return res.status(409).json({ error: 'Application is not pending review' });
    }
    if (msg.includes('invalid_action')) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    if (msg.includes('Could not find the function') || error.code === 'PGRST202') {
      return res.status(503).json({
        error: 'Admin review requires v2-migration.sql (review_adoption_application RPC)',
      });
    }
    return respondSupabaseError(res, error);
  }

  return res.json({ ok: true, action });
});
