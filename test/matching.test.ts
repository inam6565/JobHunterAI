import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/matching-service.js', () => ({
  runMatching: vi.fn(async () => ({
    scored: 7,
  })),
}));

import { createApp } from '../src/app.js';

describe('matching route', () => {
  it('runs matching successfully', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/matching/run');

    expect(response.status).toBe(200);
    expect(response.body.data.scored).toBe(7);
  });
});
