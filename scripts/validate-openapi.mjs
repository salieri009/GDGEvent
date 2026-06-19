#!/usr/bin/env node
/** Sanity-check OpenAPI file presence and version. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const specPath = resolve(process.cwd(), 'docs/openapi.yaml');
const text = readFileSync(specPath, 'utf8');

const required = ['/health', '/health/ready', '/api/pets', '/api/adoption-applications'];
const missing = required.filter((p) => !text.includes(p));

if (missing.length > 0) {
  console.error('OpenAPI missing paths:', missing.join(', '));
  process.exit(1);
}

if (!text.includes('openapi: 3.1.0')) {
  console.error('Expected openapi: 3.1.0');
  process.exit(1);
}

console.log('OpenAPI OK:', specPath);
