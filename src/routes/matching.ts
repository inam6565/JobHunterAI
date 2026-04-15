import { Router } from 'express';

import { logger } from '../lib/logger.js';
import { runMatching } from '../services/matching-service.js';

export const matchingRouter = Router();

matchingRouter.post('/run', async (_req, res) => {
  try {
    const result = await runMatching();
    return res.status(200).json({ data: result });
  } catch (error) {
    logger.error({ err: error }, 'Failed to run matching');
    return res.status(500).json({ error: 'Failed to run matching' });
  }
});
