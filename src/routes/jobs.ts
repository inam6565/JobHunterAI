import { Router } from 'express';
import { z } from 'zod';

import { getJobById, listJobs, updateJobStatus } from '../repositories/jobs-repository.js';
import { logger } from '../lib/logger.js';
import { jobStatuses } from '../types/job.js';

export const jobsRouter = Router();

const listJobsSchema = z.object({
  query: z.string().trim().min(1).max(200).optional(),
  location: z.string().trim().min(1).max(120).optional(),
  status: z.enum(jobStatuses).optional(),
  source: z.string().trim().min(1).max(120).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const jobIdSchema = z.object({
  id: z.uuid(),
});

const updateJobStatusSchema = z.object({
  status: z.enum(jobStatuses),
});

jobsRouter.get('/', async (req, res) => {
  const parsed = listJobsSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid search parameters',
      details: parsed.error.flatten(),
    });
  }

  try {
    const jobs = await listJobs(parsed.data);

    return res.status(200).json({
      data: jobs,
      meta: {
        total: jobs.length,
        filters: parsed.data,
      },
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to list jobs');
    return res.status(500).json({ error: 'Failed to list jobs' });
  }
});

jobsRouter.get('/:id', async (req, res) => {
  const parsed = jobIdSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid job id',
      details: parsed.error.flatten(),
    });
  }

  try {
    const job = await getJobById(parsed.data.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ data: job });
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch job by id');
    return res.status(500).json({ error: 'Failed to fetch job' });
  }
});

jobsRouter.patch('/:id/status', async (req, res) => {
  const parsedParams = jobIdSchema.safeParse(req.params);
  const parsedBody = updateJobStatusSchema.safeParse(req.body);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: 'Invalid job id',
      details: parsedParams.error.flatten(),
    });
  }

  if (!parsedBody.success) {
    return res.status(400).json({
      error: 'Invalid status payload',
      details: parsedBody.error.flatten(),
    });
  }

  try {
    const updatedJob = await updateJobStatus(parsedParams.data.id, parsedBody.data.status);

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    return res.status(200).json({ data: updatedJob });
  } catch (error) {
    logger.error({ err: error }, 'Failed to update job status');
    return res.status(500).json({ error: 'Failed to update job status' });
  }
});
