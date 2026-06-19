import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Response } from 'express';
import type { PostgrestError } from '@supabase/supabase-js';
import { respondSupabaseError } from './errors.js';

function mockRes() {
  const json = vi.fn();
  const status = vi.fn(() => ({ json }));
  return { status, json };
}

function schemaError(message: string): PostgrestError {
  return {
    code: 'PGRST205',
    message,
    details: '',
    hint: '',
  } as PostgrestError;
}

describe('respondSupabaseError', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('returns 404 for PGRST116', () => {
    const res = mockRes();
    respondSupabaseError(res as unknown as Response, {
      code: 'PGRST116',
      message: 'Not found',
      details: '',
      hint: '',
    } as PostgrestError);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });

  it('returns generic 503 in production without hint or details', () => {
    process.env.NODE_ENV = 'production';
    const res = mockRes();
    const msg = 'Could not find the table public.pets in the schema cache';
    respondSupabaseError(res as unknown as Response, schemaError(msg));
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({ error: 'Service unavailable' });
  });

  it('includes hint and details on 503 in non-production', () => {
    process.env.NODE_ENV = 'development';
    const res = mockRes();
    const msg = 'Could not find the table public.pets in the schema cache';
    respondSupabaseError(res as unknown as Response, schemaError(msg));
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ details: msg }));
  });
});
