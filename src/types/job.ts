export const jobStatuses = ['new', 'shortlisted', 'ignored', 'applied'] as const;

export type JobStatus = (typeof jobStatuses)[number];

export interface JobSearchFilters {
  query?: string | undefined;
  location?: string | undefined;
  status?: JobStatus | undefined;
  source?: string | undefined;
  limit: number;
}

export interface JobRecord {
  id: string;
  source: string;
  sourceJobId: string | null;
  title: string;
  company: string;
  location: string | null;
  remoteType: string | null;
  employmentType: string | null;
  url: string;
  description: string | null;
  status: JobStatus;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}
