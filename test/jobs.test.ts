import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../src/app.js';

describe('jobs route', () => {
  it('rejects invalid empty query', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/jobs?query=');

    expect(response.status).toBe(400);
  });

  it('accepts a valid query', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/jobs?query=backend%20engineer&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.meta.filters.query).toBe('backend engineer');
    expect(response.body.meta.filters.limit).toBe(10);
  });
});
