import { MockJobSourceAdapter } from './mock-adapter.js';
import { RemoteOkJobSourceAdapter } from './remoteok-adapter.js';
import type { JobSourceAdapter } from './types.js';

const adapters = new Map<string, JobSourceAdapter>([
  ['mock', new MockJobSourceAdapter()],
  ['remoteok', new RemoteOkJobSourceAdapter()],
]);

export function getAdapter(source: string): JobSourceAdapter | null {
  return adapters.get(source) ?? null;
}
