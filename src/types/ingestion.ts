export interface IngestedJobRecord {
  source: string;
  sourceJobId: string;
  title: string;
  company: string;
  location: string | null;
  remoteType: string | null;
  employmentType: string | null;
  url: string;
  description: string | null;
  score: number | null;
}

export interface IngestionRunResult {
  source: string;
  fetched: number;
  upserted: number;
  jobIds: string[];
}
