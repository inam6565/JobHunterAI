import { db } from '../db/client.js';
import type { IngestedJobRecord } from '../types/ingestion.js';
import type { JobRecord, JobSearchFilters, JobStatus } from '../types/job.js';

interface DatabaseJobRow {
  id: string;
  source: string;
  source_job_id: string | null;
  title: string;
  company: string;
  location: string | null;
  remote_type: string | null;
  employment_type: string | null;
  url: string;
  description: string | null;
  status: JobStatus;
  score: string | number | null;
  created_at: Date;
  updated_at: Date;
}

function mapRow(row: DatabaseJobRow): JobRecord {
  return {
    id: row.id,
    source: row.source,
    sourceJobId: row.source_job_id,
    title: row.title,
    company: row.company,
    location: row.location,
    remoteType: row.remote_type,
    employmentType: row.employment_type,
    url: row.url,
    description: row.description,
    status: row.status,
    score: row.score === null ? null : Number(row.score),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listJobs(filters: JobSearchFilters): Promise<JobRecord[]> {
  const values: Array<string | number> = [];
  const conditions: string[] = [];

  if (filters.query) {
    values.push(`%${filters.query}%`);
    conditions.push(`(title ILIKE $${values.length} OR company ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  if (filters.location) {
    values.push(`%${filters.location}%`);
    conditions.push(`location ILIKE $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  if (filters.source) {
    values.push(filters.source);
    conditions.push(`source = $${values.length}`);
  }

  values.push(filters.limit);

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const query = `
    SELECT id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score, created_at, updated_at
    FROM jobs
    ${whereClause}
    ORDER BY score DESC NULLS LAST, created_at DESC
    LIMIT $${values.length}
  `;

  const result = await db.query<DatabaseJobRow>(query, values);
  return result.rows.map(mapRow);
}

export async function getJobById(id: string): Promise<JobRecord | null> {
  const result = await db.query<DatabaseJobRow>(
    `
      SELECT id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score, created_at, updated_at
      FROM jobs
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapRow(row) : null;
}

export async function updateJobStatus(id: string, status: JobStatus): Promise<JobRecord | null> {
  const result = await db.query<DatabaseJobRow>(
    `
      UPDATE jobs
      SET status = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score, created_at, updated_at
    `,
    [id, status],
  );

  const row = result.rows[0];
  return row ? mapRow(row) : null;
}

export async function upsertJobs(
  jobs: Array<IngestedJobRecord & { id: string }>,
): Promise<JobRecord[]> {
  const upsertedJobs: JobRecord[] = [];

  for (const job of jobs) {
    const result = await db.query<DatabaseJobRow>(
      `
        INSERT INTO jobs (
          id,
          source,
          source_job_id,
          title,
          company,
          location,
          remote_type,
          employment_type,
          url,
          description,
          status,
          score
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new', $11)
        ON CONFLICT (source, source_job_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          company = EXCLUDED.company,
          location = EXCLUDED.location,
          remote_type = EXCLUDED.remote_type,
          employment_type = EXCLUDED.employment_type,
          url = EXCLUDED.url,
          description = EXCLUDED.description,
          score = EXCLUDED.score,
          updated_at = NOW()
        RETURNING id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score, created_at, updated_at
      `,
      [
        job.id,
        job.source,
        job.sourceJobId,
        job.title,
        job.company,
        job.location,
        job.remoteType,
        job.employmentType,
        job.url,
        job.description,
        job.score,
      ],
    );

    const row = result.rows[0];

    if (row) {
      upsertedJobs.push(mapRow(row));
    }
  }

  return upsertedJobs;
}
