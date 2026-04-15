import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { dbHealthRouter } from './routes/db-health.js';
import { healthRouter } from './routes/health.js';
import { jobsRouter } from './routes/jobs.js';
import { preferencesRouter, profileRouter } from './routes/profile.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: env.ALLOWED_ORIGIN,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: '1mb' }));
  app.use(pinoHttp({ logger }));

  app.use('/health', healthRouter);
  app.use('/health/db', dbHealthRouter);
  app.use('/api/v1/jobs', jobsRouter);
  app.use('/api/v1/profile', profileRouter);
  app.use('/api/v1/preferences', preferencesRouter);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err: error }, 'Unhandled application error');
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
