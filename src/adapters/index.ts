import { MockJobSourceAdapter } from './mock-adapter.js';
import type { JobSourceAdapter } from './types.js';

const adapters = new Map<string, JobSourceAdapter>([['mock', new MockJobSourceAdapter()]]);

export function getAdapter(source: string): JobSourceAdapter | null {
  return adapters.get(source) ?? null;
}
