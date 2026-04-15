import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/repositories/jobs-repository.js', () => ({
  listJobs: vi.fn(async (filters) => [
    {
      id: '11111111-1111-4111-8111-111111111111',
      source: 'seed-linkedin',
      sourceJobId: 'seed-001',
      title: 'Backend Engineer',
      company: 'Acme Systems',
      location: 'Berlin, Germany',
      remoteType: 'remote',
      employmentType: 'full-time',
      url: 'https://example.com/jobs/backend-engineer',
      description: 'Build backend services and APIs for internal platforms.',
      status: 'new',
      score: 87.5,
      createdAt: '2026-04-15T00:00:00.000Z',
      updatedAt: '2026-04-15T00:00:00.000Z',
    },
  ]),
  getJobById: vi.fn(async (id: string) => {
    if (id === '11111111-1111-4111-8111-111111111111') {
      return {
        id,
        source: 'seed-linkedin',
        sourceJobId: 'seed-001',
        title: 'Backend Engineer',
        company: 'Acme Systems',
        location: 'Berlin, Germany',
        remoteType: 'remote',
        employmentType: 'full-time',
        url: 'https://example.com/jobs/backend-engineer',
        description: 'Build backend services and APIs for internal platforms.',
        status: 'new',
        score: 87.5,
        createdAt: '2026-04-15T00:00:00.000Z',
        updatedAt: '2026-04-15T00:00:00.000Z',
      };
    }

    return null;
  }),
  updateJobStatus: vi.fn(async (id: string, status: string) => {
    if (id !== '11111111-1111-4111-8111-111111111111') {
      return null;
    }

    return {
      id,
      source: 'seed-linkedin',
      sourceJobId: 'seed-001',
      title: 'Backend Engineer',
      company: 'Acme Systems',
      location: 'Berlin, Germany',
      remoteType: 'remote',
      employmentType: 'full-time',
      url: 'https://example.com/jobs/backend-engineer',
      description: 'Build backend services and APIs for internal platforms.',
      status,
      score: 87.5,
      createdAt: '2026-04-15T00:00:00.000Z',
      updatedAt: '2026-04-15T00:00:00.000Z',
    };
  }),
}));

import { createApp } from '../src/app.js';

describe('jobs route', () => {
  it('lists jobs from the repository', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/jobs?query=backend&limit=10');

    expect(response.status).toBe(200);
    expect(response.body.meta.filters.query).toBe('backend');
    expect(response.body.data).toHaveLength(1);
  });

  it('fetches a job by id', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/jobs/11111111-1111-4111-8111-111111111111');

    expect(response.status).toBe(200);
    expect(response.body.data.id).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('returns 404 for missing jobs', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/jobs/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa');

    expect(response.status).toBe(404);
  });

  it('updates a job status', async () => {
    const app = createApp();
    const response = await request(app)
      .patch('/api/v1/jobs/11111111-1111-4111-8111-111111111111/status')
      .send({ status: 'shortlisted' });

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('shortlisted');
  });

  it('rejects invalid status values', async () => {
    const app = createApp();
    const response = await request(app)
      .patch('/api/v1/jobs/11111111-1111-4111-8111-111111111111/status')
      .send({ status: 'definitely-not-valid' });

    expect(response.status).toBe(400);
  });
});
