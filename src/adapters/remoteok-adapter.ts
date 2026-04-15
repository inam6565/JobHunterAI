import type { JobSourceAdapter } from './types.js';
import type { IngestedJobRecord } from '../types/ingestion.js';

interface RemoteOkJobRow {
  id?: string | number;
  slug?: string;
  position?: string;
  company?: string;
  location?: string;
  tags?: string[];
  url?: string;
  description?: string;
  salary_min?: number;
}

interface RemoteOkJobPayload extends RemoteOkJobRow {
  id: string | number;
  position: string;
  company: string;
}

function inferRemoteType(location: string | undefined): string | null {
  if (!location) {
    return 'remote';
  }

  return location.toLowerCase().includes('remote') ? 'remote' : 'flexible';
}

function isRemoteOkJobPayload(row: unknown): row is RemoteOkJobPayload {
  if (typeof row !== 'object' || row === null) {
    return false;
  }

  const candidate = row as RemoteOkJobRow;

  return (
    (typeof candidate.id === 'string' || typeof candidate.id === 'number') &&
    typeof candidate.position === 'string' &&
    typeof candidate.company === 'string'
  );
}

export class RemoteOkJobSourceAdapter implements JobSourceAdapter {
  readonly source = 'remoteok';

  async fetchJobs(): Promise<IngestedJobRecord[]> {
    const response = await fetch('https://remoteok.com/api', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'JobHunterAI/0.1 (+https://github.com/inam6565/JobHunterAI)',
      },
    });

    if (!response.ok) {
      throw new Error(`RemoteOK request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as unknown;

    if (!Array.isArray(payload)) {
      throw new Error('RemoteOK API returned an unexpected payload shape');
    }

    return payload.filter(isRemoteOkJobPayload).map((row) => ({
      source: 'remoteok',
      sourceJobId: String(row.id),
      title: row.position,
      company: row.company,
      location: row.location ?? 'Remote',
      remoteType: inferRemoteType(row.location),
      employmentType: 'full-time',
      url: row.url ?? (row.slug ? `https://remoteok.com/remote-jobs/${row.slug}` : 'https://remoteok.com/'),
      description: row.description ?? null,
      score: null,
    }));
  }
}
