import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/db/health.js', () => ({
  checkDatabaseHealth: vi.fn().mockResolvedValue(true),
}));

import { createApp } from '../src/app.js';

describe('database health route', () => {
  it('returns ok when database is reachable', async () => {
    const app = createApp();
    const response = await request(app).get('/health/db');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', dependency: 'postgres' });
  });
});
