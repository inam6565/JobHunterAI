import { getPreferences, getProfile } from '../repositories/profile-repository.js';
import { listJobsForMatching, updateJobScores } from '../repositories/jobs-repository.js';
import type { JobRecord } from '../types/job.js';

interface JobScoreBreakdown {
  scoreTitle: number;
  scoreSkills: number;
  scoreLocation: number;
  scoreRemote: number;
  scoreEmployment: number;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function scoreTitle(job: JobRecord, desiredTitles: string[]): number {
  const title = normalize(job.title);
  for (const desiredTitle of desiredTitles) {
    const desired = normalize(desiredTitle);
    if (title === desired) {
      return 40;
    }
    if (title.includes(desired) || desired.includes(title)) {
      return 32;
    }
    const desiredWords = desired.split(/\s+/).filter(Boolean);
    const overlap = desiredWords.filter((word) => title.includes(word)).length;
    if (overlap >= 2) {
      return 24;
    }
    if (overlap >= 1) {
      return 12;
    }
  }

  return 0;
}

function scoreSkills(job: JobRecord, skills: string[]): number {
  const haystack = normalize(`${job.title} ${job.description ?? ''}`);
  const matchedSkills = skills.filter((skill) => {
    const normalizedSkill = normalize(skill);
    if (normalizedSkill.includes('cloud')) {
      return haystack.includes('cloud') || haystack.includes('aws') || haystack.includes('gcp') || haystack.includes('azure');
    }
    return haystack.includes(normalizedSkill);
  }).length;

  return Math.min(30, matchedSkills * 6);
}

function scoreLocation(job: JobRecord, preferredLocations: string[]): number {
  const location = normalize(job.location ?? '');
  if (location.includes('remote')) {
    return 15;
  }

  for (const preferredLocation of preferredLocations) {
    if (location.includes(normalize(preferredLocation))) {
      return 15;
    }
  }

  return 0;
}

function scoreRemote(job: JobRecord, remotePreference: string): number {
  if (remotePreference === 'flexible') {
    if (job.remoteType === 'remote') {
      return 10;
    }
    if (job.remoteType === 'hybrid' || job.remoteType === 'onsite' || job.remoteType === 'flexible') {
      return 7;
    }
    return 5;
  }

  return job.remoteType === remotePreference ? 10 : 0;
}

function scoreEmployment(job: JobRecord, employmentTypes: string[]): number {
  if (!job.employmentType) {
    return 0;
  }

  return employmentTypes.some((employmentType) => normalize(employmentType) === normalize(job.employmentType ?? '')) ? 5 : 0;
}

function buildMatchReasons(job: JobRecord, breakdown: JobScoreBreakdown): string[] {
  const reasons: string[] = [];

  if (breakdown.scoreTitle > 0) {
    reasons.push('Title aligns with your target roles.');
  }
  if (breakdown.scoreSkills > 0) {
    reasons.push('Job mentions skills relevant to your profile.');
  }
  if (breakdown.scoreLocation > 0) {
    reasons.push('Location aligns with your preferences.');
  }
  if (breakdown.scoreRemote > 0) {
    reasons.push('Work mode fits your remote preference.');
  }
  if (breakdown.scoreEmployment > 0) {
    reasons.push('Employment type matches your preference.');
  }
  if (reasons.length === 0) {
    reasons.push('Low-confidence match based on current preferences.');
  }

  return reasons;
}

export async function runMatching(): Promise<{ scored: number }> {
  const profile = await getProfile();
  const preferences = await getPreferences();

  if (!profile || !preferences) {
    throw new Error('Profile or preferences are missing');
  }

  const jobs = await listJobsForMatching();

  for (const job of jobs) {
    const breakdown: JobScoreBreakdown = {
      scoreTitle: scoreTitle(job, preferences.desiredTitles),
      scoreSkills: scoreSkills(job, profile.skills),
      scoreLocation: scoreLocation(job, preferences.preferredLocations),
      scoreRemote: scoreRemote(job, preferences.remotePreference),
      scoreEmployment: scoreEmployment(job, preferences.employmentTypes),
    };

    const score = breakdown.scoreTitle + breakdown.scoreSkills + breakdown.scoreLocation + breakdown.scoreRemote + breakdown.scoreEmployment;

    await updateJobScores(job.id, {
      score,
      ...breakdown,
      matchReasons: buildMatchReasons(job, breakdown),
    });
  }

  return { scored: jobs.length };
}
