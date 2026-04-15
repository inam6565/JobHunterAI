export interface JobSearchFilters {
  query: string;
  location?: string;
  limit: number;
}

export interface JobRecord {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string | null;
  url: string;
  createdAt: string;
}
