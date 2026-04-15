import { Router } from 'express';

import { checkDatabaseHealth } from '../db/health.js';
import { logger } from '../lib/logger.js';

export const dbHealthRouter = Router();

dbHealthRouter.get('/', async (_req, res) => {
  try {
    const ok = await checkDatabaseHealth();

    if (!ok) {
      return res.status(503).json({ status: 'error', dependency: 'postgres' });
    }

    return res.status(200).json({ status: 'ok', dependency: 'postgres' });
  } catch (error) {
    logger.error({ err: error }, 'Database health check failed');
    return res.status(503).json({ status: 'error', dependency: 'postgres' });
  }
});
