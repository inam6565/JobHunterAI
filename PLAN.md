# JobHunterAI Plan

## Clean description

JobHunterAI is a job discovery and matching tool that uses a user's resume, LinkedIn profile, and preferences to aggregate, normalize, and rank job listings from multiple sources, helping them find the most relevant opportunities faster.

## Suggested MVP

Focus on a narrow, defensible first version:
- profile intake via resume upload plus manual preferences
- one or two job sources first, not ten
- normalization into one internal schema
- duplicate detection
- simple relevance scoring
- searchable shortlist output

## Why this scope

Trying to scrape everything on day one is how projects turn into a mess.
A tight MVP ships faster, breaks less, and gives you real feedback before you build a spider empire.

## Open questions

1. Is this a web app, backend service, CLI, or hybrid?
2. Do you want browser automation/scraping where APIs do not exist?
3. Which sources are required for MVP?
4. Should users upload resumes as PDF/DOCX, or paste text too?
5. Do you want AI ranking and summary generation in v1, or rule-based ranking first?
6. Will this be single-user at first, or multi-user with accounts?
7. Do you want scheduled refresh jobs from day one?
8. What is the target deployment shape on the VPS: one container, or app + worker + database?

## Opinionated recommendation

For MVP:
- backend: Node.js + TypeScript
- parsing/ETL helpers: Python only if needed later
- frontend: skip unless you explicitly want one now
- start as an API service with a worker if scraping is needed
- store normalized jobs in PostgreSQL
- use Redis only if background queues become necessary
- start with 2 sources max
- keep ranking explainable before adding LLM glitter
