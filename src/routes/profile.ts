import { Router } from 'express';
import { z } from 'zod';

import { logger } from '../lib/logger.js';
import { getProfile, getPreferences, replacePreferences, replaceProfile } from '../repositories/profile-repository.js';
import { remotePreferences } from '../types/profile.js';

export const profileRouter = Router();
export const preferencesRouter = Router();

const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  headline: z.string().trim().min(1).max(200).nullable(),
  summary: z.string().trim().min(1).max(2000).nullable(),
  skills: z.array(z.string().trim().min(1).max(80)).min(1).max(50),
  yearsOfExperience: z.number().int().min(0).max(60).nullable(),
  workAuthorization: z.string().trim().min(1).max(200).nullable(),
});

const preferencesSchema = z.object({
  desiredTitles: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
  preferredLocations: z.array(z.string().trim().min(1).max(120)).min(1).max(20),
  remotePreference: z.enum(remotePreferences),
  employmentTypes: z.array(z.string().trim().min(1).max(60)).min(1).max(10),
  salaryMin: z.number().int().min(0).max(100000000).nullable(),
  salaryCurrency: z.string().trim().min(1).max(10).nullable(),
  notes: z.string().trim().min(1).max(1000).nullable(),
});

profileRouter.get('/', async (_req, res) => {
  try {
    const profile = await getProfile();

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ data: profile });
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch profile');
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

profileRouter.put('/', async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid profile payload',
      details: parsed.error.flatten(),
    });
  }

  try {
    const profile = await replaceProfile(parsed.data);
    return res.status(200).json({ data: profile });
  } catch (error) {
    logger.error({ err: error }, 'Failed to update profile');
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

preferencesRouter.get('/', async (_req, res) => {
  try {
    const preferences = await getPreferences();

    if (!preferences) {
      return res.status(404).json({ error: 'Preferences not found' });
    }

    return res.status(200).json({ data: preferences });
  } catch (error) {
    logger.error({ err: error }, 'Failed to fetch preferences');
    return res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

preferencesRouter.put('/', async (req, res) => {
  const parsed = preferencesSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid preferences payload',
      details: parsed.error.flatten(),
    });
  }

  try {
    const preferences = await replacePreferences(parsed.data);
    return res.status(200).json({ data: preferences });
  } catch (error) {
    logger.error({ err: error }, 'Failed to update preferences');
    return res.status(500).json({ error: 'Failed to update preferences' });
  }
});
