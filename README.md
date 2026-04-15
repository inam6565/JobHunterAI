# JobHunterAI

JobHunterAI is a job discovery and matching tool that uses a user's resume, LinkedIn profile, and preferences to aggregate, normalize, and rank job listings from multiple sources.

## MVP stack

- Node.js 22 + TypeScript
- Express API
- PostgreSQL
- Docker + Docker Compose
- Vitest for tests
- ESLint + Prettier
- GitHub Actions CI
- CodeQL + Dependabot

## Current status

Initial backend scaffold is in place.

## Implemented so far

- secure Express API foundation
- environment validation with `dotenv-safe` and `zod`
- health endpoint
- database health endpoint at `/health/db`
- DB-backed jobs API with seeded data
- single-user profile and preferences APIs
- ingestion pipeline with mock adapter
- first real source adapter via RemoteOK JSON feed
- deterministic matching engine with persisted score breakdown fields
- PostgreSQL connection scaffold and bootstrap SQL
- test scaffolding
- Dockerfile and Compose stack
- CI workflow and GitHub security baseline

## Project structure

```text
src/
  config/
  lib/
  routes/
test/
.github/
```

## Local development

1. Copy the env template:
   - `cp .env.example .env`
2. Install dependencies:
   - `npm ci`
3. Start the app locally:
   - `npm run dev`
4. Run checks:
   - `npm run ci`

## Docker

Start the local stack:
- `docker compose up --build`

## Service endpoints

Once the service is running:
- Health: `http://localhost:3000/health`
- DB health: `http://localhost:3000/health/db`
- Jobs search: `http://localhost:3000/api/v1/jobs?query=backend%20engineer&limit=10`
- Profile: `http://localhost:3000/api/v1/profile`
- Preferences: `http://localhost:3000/api/v1/preferences`
- Run mock ingestion: `POST http://localhost:3000/api/v1/ingestion/run` with `{ "source": "mock" }`
- Run RemoteOK ingestion: `POST http://localhost:3000/api/v1/ingestion/run` with `{ "source": "remoteok" }`
- Run score recompute: `POST http://localhost:3000/api/v1/matching/run`

## Security notes

- do not commit `.env`
- protect resume and profile data aggressively
- minimize stored personal data
- respect source terms and access constraints

## Next steps

- improve matching heuristics and tuning
- improve RemoteOK normalization and source-specific mapping
- add the next real source adapter
- add resume ingestion flow
- add a lightweight UI for review workflows
