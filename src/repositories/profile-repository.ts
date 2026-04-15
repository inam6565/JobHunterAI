import { db } from '../db/client.js';
import type { JobPreferenceRecord, RemotePreference, UserProfileRecord } from '../types/profile.js';

const SEEDED_PROFILE_ID = 'aaaaaaaa-1111-4111-8111-111111111111';
const SEEDED_PREFERENCES_ID = 'bbbbbbbb-2222-4222-8222-222222222222';

interface UserProfileRow {
  id: string;
  full_name: string;
  headline: string | null;
  summary: string | null;
  skills: string[];
  years_of_experience: number | null;
  work_authorization: string | null;
  created_at: Date;
  updated_at: Date;
}

interface JobPreferenceRow {
  id: string;
  user_profile_id: string;
  desired_titles: string[];
  preferred_locations: string[];
  remote_preference: RemotePreference;
  employment_types: string[];
  salary_min: number | null;
  salary_currency: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

function mapUserProfile(row: UserProfileRow): UserProfileRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    headline: row.headline,
    summary: row.summary,
    skills: row.skills,
    yearsOfExperience: row.years_of_experience,
    workAuthorization: row.work_authorization,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapJobPreferences(row: JobPreferenceRow): JobPreferenceRecord {
  return {
    id: row.id,
    userProfileId: row.user_profile_id,
    desiredTitles: row.desired_titles,
    preferredLocations: row.preferred_locations,
    remotePreference: row.remote_preference,
    employmentTypes: row.employment_types,
    salaryMin: row.salary_min,
    salaryCurrency: row.salary_currency,
    notes: row.notes,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function getProfile(): Promise<UserProfileRecord | null> {
  const result = await db.query<UserProfileRow>(
    `
      SELECT id, full_name, headline, summary, skills, years_of_experience, work_authorization, created_at, updated_at
      FROM user_profiles
      WHERE id = $1
      LIMIT 1
    `,
    [SEEDED_PROFILE_ID],
  );

  const row = result.rows[0];
  return row ? mapUserProfile(row) : null;
}

export async function replaceProfile(input: {
  fullName: string;
  headline: string | null;
  summary: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  workAuthorization: string | null;
}): Promise<UserProfileRecord> {
  const result = await db.query<UserProfileRow>(
    `
      UPDATE user_profiles
      SET full_name = $2,
          headline = $3,
          summary = $4,
          skills = $5,
          years_of_experience = $6,
          work_authorization = $7,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, full_name, headline, summary, skills, years_of_experience, work_authorization, created_at, updated_at
    `,
    [
      SEEDED_PROFILE_ID,
      input.fullName,
      input.headline,
      input.summary,
      input.skills,
      input.yearsOfExperience,
      input.workAuthorization,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error('Seeded profile row was not found during update');
  }

  return mapUserProfile(row);
}

export async function getPreferences(): Promise<JobPreferenceRecord | null> {
  const result = await db.query<JobPreferenceRow>(
    `
      SELECT id, user_profile_id, desired_titles, preferred_locations, remote_preference, employment_types, salary_min, salary_currency, notes, created_at, updated_at
      FROM job_preferences
      WHERE id = $1
      LIMIT 1
    `,
    [SEEDED_PREFERENCES_ID],
  );

  const row = result.rows[0];
  return row ? mapJobPreferences(row) : null;
}

export async function replacePreferences(input: {
  desiredTitles: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  employmentTypes: string[];
  salaryMin: number | null;
  salaryCurrency: string | null;
  notes: string | null;
}): Promise<JobPreferenceRecord> {
  const result = await db.query<JobPreferenceRow>(
    `
      UPDATE job_preferences
      SET desired_titles = $2,
          preferred_locations = $3,
          remote_preference = $4,
          employment_types = $5,
          salary_min = $6,
          salary_currency = $7,
          notes = $8,
          updated_at = NOW()
      WHERE id = $1
      RETURNING id, user_profile_id, desired_titles, preferred_locations, remote_preference, employment_types, salary_min, salary_currency, notes, created_at, updated_at
    `,
    [
      SEEDED_PREFERENCES_ID,
      input.desiredTitles,
      input.preferredLocations,
      input.remotePreference,
      input.employmentTypes,
      input.salaryMin,
      input.salaryCurrency,
      input.notes,
    ],
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error('Seeded preferences row was not found during update');
  }

  return mapJobPreferences(row);
}
