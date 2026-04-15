import type { JobSourceAdapter } from './types.js';
import type { IngestedJobRecord } from '../types/ingestion.js';

const mockJobs: IngestedJobRecord[] = [
  {
    source: 'mock',
    sourceJobId: 'mock-001',
    title: 'Site Reliability Engineer',
    company: 'Nebula Systems',
    location: 'Remote',
    remoteType: 'remote',
    employmentType: 'full-time',
    url: 'https://example.com/jobs/mock-sre',
    description: 'Improve platform reliability, monitoring, and incident response.',
    score: 88.5,
  },
  {
    source: 'mock',
    sourceJobId: 'mock-002',
    title: 'Cloud Infrastructure Engineer',
    company: 'Atlas Compute',
    location: 'Pakistan',
    remoteType: 'flexible',
    employmentType: 'full-time',
    url: 'https://example.com/jobs/mock-cloud-infra',
    description: 'Design and operate cloud infrastructure across multiple environments.',
    score: 90.0,
  },
  {
    source: 'mock',
    sourceJobId: 'mock-003',
    title: 'Linux Platform Engineer',
    company: 'Kernel Works',
    location: 'Remote',
    remoteType: 'remote',
    employmentType: 'full-time',
    url: 'https://example.com/jobs/mock-linux-platform',
    description: 'Own Linux systems, automation, and platform stability.',
    score: 86.0,
  },
];

export class MockJobSourceAdapter implements JobSourceAdapter {
  readonly source = 'mock';

  async fetchJobs(): Promise<IngestedJobRecord[]> {
    return mockJobs;
  }
}
