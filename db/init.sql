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

CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs (source);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs (company);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs (created_at DESC);

INSERT INTO jobs (id, source, source_job_id, title, company, location, remote_type, employment_type, url, description, status, score)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'seed-linkedin', 'seed-001', 'Backend Engineer', 'Acme Systems', 'Berlin, Germany', 'remote', 'full-time', 'https://example.com/jobs/backend-engineer', 'Build backend services and APIs for internal platforms.', 'new', 87.50),
  ('22222222-2222-4222-8222-222222222222', 'seed-indeed', 'seed-002', 'Full Stack Developer', 'Northstar Labs', 'Remote', 'remote', 'full-time', 'https://example.com/jobs/full-stack-developer', 'Work across frontend and backend systems for customer-facing products.', 'new', 82.00),
  ('33333333-3333-4333-8333-333333333333', 'seed-googlejobs', 'seed-003', 'AI Engineer', 'Vector Dynamics', 'Dubai, UAE', 'hybrid', 'full-time', 'https://example.com/jobs/ai-engineer', 'Develop AI-powered workflows and model-backed product features.', 'shortlisted', 91.25),
  ('44444444-4444-4444-8444-444444444444', 'seed-monster', 'seed-004', 'Platform Engineer', 'Orbit Cloud', 'London, UK', 'onsite', 'full-time', 'https://example.com/jobs/platform-engineer', 'Maintain deployment platforms, observability, and infrastructure tooling.', 'applied', 78.00)
ON CONFLICT (id) DO NOTHING;
