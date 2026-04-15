import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../src/repositories/profile-repository.js', () => ({
  getProfile: vi.fn(async () => ({
    id: 'aaaaaaaa-1111-4111-8111-111111111111',
    fullName: 'Inam Ur Rehman',
    headline: 'DevOps Engineer / Linux Systems Engineer / Cloud Engineer / Infrastructure Engineer',
    summary: 'short developer summary',
    skills: ['Linux', 'Networking', 'Docker', 'PostgreSQL', 'Cloud (AWS/GCP/Azure)'],
    yearsOfExperience: 3,
    workAuthorization: 'Open to roles based on eligibility requirements',
    createdAt: '2026-04-15T00:00:00.000Z',
    updatedAt: '2026-04-15T00:00:00.000Z',
  })),
  replaceProfile: vi.fn(async (payload) => ({
    id: 'aaaaaaaa-1111-4111-8111-111111111111',
    ...payload,
    createdAt: '2026-04-15T00:00:00.000Z',
    updatedAt: '2026-04-15T00:00:00.000Z',
  })),
  getPreferences: vi.fn(async () => ({
    id: 'bbbbbbbb-2222-4222-8222-222222222222',
    userProfileId: 'aaaaaaaa-1111-4111-8111-111111111111',
    desiredTitles: ['DevOps Engineer', 'Linux Systems Engineer', 'Cloud Engineer', 'Infrastructure Engineer'],
    preferredLocations: ['Remote', 'Pakistan'],
    remotePreference: 'flexible',
    employmentTypes: ['full-time'],
    salaryMin: null,
    salaryCurrency: 'USD',
    notes: 'Open to strong infrastructure, cloud, platform, and systems roles.',
    createdAt: '2026-04-15T00:00:00.000Z',
    updatedAt: '2026-04-15T00:00:00.000Z',
  })),
  replacePreferences: vi.fn(async (payload) => ({
    id: 'bbbbbbbb-2222-4222-8222-222222222222',
    userProfileId: 'aaaaaaaa-1111-4111-8111-111111111111',
    ...payload,
    createdAt: '2026-04-15T00:00:00.000Z',
    updatedAt: '2026-04-15T00:00:00.000Z',
  })),
}));

import { createApp } from '../src/app.js';

describe('profile route', () => {
  it('gets the profile', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/profile');

    expect(response.status).toBe(200);
    expect(response.body.data.fullName).toBe('Inam Ur Rehman');
  });

  it('replaces the profile', async () => {
    const app = createApp();
    const response = await request(app).put('/api/v1/profile').send({
      fullName: 'Inam Ur Rehman',
      headline: 'Cloud Engineer',
      summary: 'Focused on cloud and infrastructure.',
      skills: ['Linux', 'Docker', 'PostgreSQL'],
      yearsOfExperience: 3,
      workAuthorization: 'Open to roles based on eligibility requirements',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.headline).toBe('Cloud Engineer');
  });

  it('rejects invalid profile payloads', async () => {
    const app = createApp();
    const response = await request(app).put('/api/v1/profile').send({
      fullName: '',
      headline: null,
      summary: null,
      skills: [],
      yearsOfExperience: 3,
      workAuthorization: null,
    });

    expect(response.status).toBe(400);
  });
});

describe('preferences route', () => {
  it('gets preferences', async () => {
    const app = createApp();
    const response = await request(app).get('/api/v1/preferences');

    expect(response.status).toBe(200);
    expect(response.body.data.remotePreference).toBe('flexible');
  });

  it('replaces preferences', async () => {
    const app = createApp();
    const response = await request(app).put('/api/v1/preferences').send({
      desiredTitles: ['DevOps Engineer'],
      preferredLocations: ['Remote', 'Pakistan'],
      remotePreference: 'remote',
      employmentTypes: ['full-time'],
      salaryMin: null,
      salaryCurrency: 'USD',
      notes: 'Open to remote infrastructure roles.',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.remotePreference).toBe('remote');
  });

  it('rejects invalid preferences payloads', async () => {
    const app = createApp();
    const response = await request(app).put('/api/v1/preferences').send({
      desiredTitles: [],
      preferredLocations: [],
      remotePreference: 'spaceship-mode',
      employmentTypes: [],
      salaryMin: null,
      salaryCurrency: 'USD',
      notes: null,
    });

    expect(response.status).toBe(400);
  });
});
