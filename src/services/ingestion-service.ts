import { randomUUID } from 'node:crypto';

import { getAdapter } from '../adapters/index.js';
import { upsertJobs } from '../repositories/jobs-repository.js';
import type { IngestionRunResult } from '../types/ingestion.js';

export async function runIngestion(source: string): Promise<IngestionRunResult> {
  const adapter = getAdapter(source);

  if (!adapter) {
    throw new Error(`Unsupported source adapter: ${source}`);
  }

  const jobs = await adapter.fetchJobs();
  const normalizedJobs = jobs.map((job) => ({
    ...job,
    id: randomUUID(),
  }));

  const upsertedJobs = await upsertJobs(normalizedJobs);

  return {
    source: adapter.source,
    fetched: jobs.length,
    upserted: upsertedJobs.length,
    jobIds: upsertedJobs.map((job) => job.id),
  };
}
