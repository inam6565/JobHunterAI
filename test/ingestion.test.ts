import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/services/ingestion-service.js', () => ({
  runIngestion: vi.fn(async (source: string) => ({
    source,
    fetched: 3,
    upserted: 3,
    jobIds: [
      '55555555-5555-4555-8555-555555555555',
      '66666666-6666-4666-8666-666666666666',
      '77777777-7777-4777-8777-777777777777',
    ],
  })),
}));

import { createApp } from '../src/app.js';

describe('ingestion route', () => {
  it('runs mock ingestion successfully', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/ingestion/run').send({ source: 'mock' });

    expect(response.status).toBe(200);
    expect(response.body.data.source).toBe('mock');
    expect(response.body.data.upserted).toBe(3);
  });

  it('runs remoteok ingestion successfully', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/ingestion/run').send({ source: 'remoteok' });

    expect(response.status).toBe(200);
    expect(response.body.data.source).toBe('remoteok');
  });

  it('rejects invalid ingestion payloads', async () => {
    const app = createApp();
    const response = await request(app).post('/api/v1/ingestion/run').send({ source: 'linkedin' });

    expect(response.status).toBe(400);
  });
});
