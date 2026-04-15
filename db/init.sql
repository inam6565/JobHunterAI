CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  source TEXT NOT NULL,
  source_job_id TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  remote_type TEXT,
  employment_type TEXT,
  url TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'shortlisted', 'ignored', 'applied')),
  score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL,
  headline TEXT,
  summary TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  years_of_experience INTEGER,
  work_authorization TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_preferences (
  id UUID PRIMARY KEY,
  user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  desired_titles TEXT[] NOT NULL DEFAULT '{}',
  preferred_locations TEXT[] NOT NULL DEFAULT '{}',
  remote_preference TEXT NOT NULL CHECK (remote_preference IN ('remote', 'hybrid', 'onsite', 'flexible')),
  employment_types TEXT[] NOT NULL DEFAULT '{}',
  salary_min INTEGER,
  salary_currency TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_source_source_job_id_key;
ALTER TABLE jobs ADD CONSTRAINT jobs_source_source_job_id_key UNIQUE (source, source_job_id);

CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs (source);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs (company);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_preferences_user_profile_id ON job_preferences (user_profile_id);

INSERT INTO jobs (id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'seed-linkedin', 'seed-001', 'Backend Engineer', 'Acme Systems', 'Berlin, Germany', 'remote', 'full-time', 'https://example.com/jobs/backend-engineer', 'Build backend services and APIs for internal platforms.', 'new', 87.50),
  ('22222222-2222-4222-8222-222222222222', 'seed-indeed', 'seed-002', 'Full Stack Developer', 'Northstar Labs', 'Remote', 'remote', 'full-time', 'https://example.com/jobs/full-stack-developer', 'Work across frontend and backend systems for customer-facing products.', 'new', 82.00),
  ('33333333-3333-4333-8333-333333333333', 'seed-googlejobs', 'seed-003', 'AI Engineer', 'Vector Dynamics', 'Dubai, UAE', 'hybrid', 'full-time', 'https://example.com/jobs/ai-engineer', 'Develop AI-powered workflows and model-backed product features.', 'shortlisted', 91.25),
  ('44444444-4444-4444-8444-444444444444', 'seed-monster', 'seed-004', 'Platform Engineer', 'Orbit Cloud', 'London, UK', 'onsite', 'full-time', 'https://example.com/jobs/platform-engineer', 'Maintain deployment platforms, observability, and infrastructure tooling.', 'applied', 78.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profiles (id, full_name, headline, summary, skills, years_of_experience, work_authorization)
VALUES (
  'aaaaaaaa-1111-4111-8111-111111111111',
  'Inam Ur Rehman',
  'DevOps Engineer / Linux Systems Engineer / Cloud Engineer / Infrastructure Engineer',
  'short developer summary',
  ARRAY['Linux', 'Networking', 'Docker', 'PostgreSQL', 'Cloud (AWS/GCP/Azure)'],
  3,
  'Open to roles based on eligibility requirements'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_preferences (id, user_profile_id, desired_titles, preferred_locations, remote_preference, employment_types, salary_min, salary_currency, notes)
VALUES (
  'bbbbbbbb-2222-4222-8222-222222222222',
  'aaaaaaaa-1111-4111-8111-111111111111',
  ARRAY['DevOps Engineer', 'Linux Systems Engineer', 'Cloud Engineer', 'Infrastructure Engineer'],
  ARRAY['Remote', 'Pakistan'],
  'flexible',
  ARRAY['full-time'],
  NULL,
  'USD',
  'Open to strong infrastructure, cloud, platform, and systems roles.'
)
ON CONFLICT (id) DO NOTHING;
