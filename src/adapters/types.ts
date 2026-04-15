import type { IngestedJobRecord } from '../types/ingestion.js';

export interface JobSourceAdapter {
  readonly source: string;
  fetchJobs(): Promise<IngestedJobRecord[]>;
}
