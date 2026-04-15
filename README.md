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
- placeholder jobs search endpoint with input validation
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

## Security notes

- do not commit `.env`
- protect resume and profile data aggressively
- minimize stored personal data
- respect source terms and access constraints

## Next steps

- add PostgreSQL integration
- define normalized job schema
- add resume ingestion flow
- implement first source adapters
- add ranking logic
