import { Router } from 'express';
import { z } from 'zod';

import { logger } from '../lib/logger.js';
import { runIngestion } from '../services/ingestion-service.js';

export const ingestionRouter = Router();

const runIngestionSchema = z.object({
  source: z.literal('mock'),
});

ingestionRouter.post('/run', async (req, res) => {
  const parsed = runIngestionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid ingestion payload',
      details: parsed.error.flatten(),
    });
  }

  try {
    const result = await runIngestion(parsed.data.source);
    return res.status(200).json({ data: result });
  } catch (error) {
    logger.error({ err: error }, 'Failed to run ingestion');
    return res.status(500).json({ error: 'Failed to run ingestion' });
  }
});
