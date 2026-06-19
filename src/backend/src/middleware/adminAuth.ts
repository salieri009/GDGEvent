import type { NextFunction, Request, Response } from 'express';
import { env } from '../env.js';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!env.ADMIN_API_KEY) {
    return res.status(503).json({ error: 'Admin API not configured' });
  }

  const key = req.header('X-Admin-Key');
  if (!key || key !== env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
}
