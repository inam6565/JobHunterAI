import { Router } from 'express';
import { z } from 'zod';

export const jobsRouter = Router();

const searchSchema = z.object({
  query: z.string().trim().min(1).max(200),
  location: z.string().trim().min(1).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

jobsRouter.get('/', (req, res) => {
  const parsed = searchSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid search parameters',
      details: parsed.error.flatten(),
    });
  }

  return res.status(200).json({
    data: [],
    meta: {
      message: 'Search pipeline not implemented yet',
      filters: parsed.data,
    },
  });
});
