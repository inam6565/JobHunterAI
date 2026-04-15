export const remotePreferences = ['remote', 'hybrid', 'onsite', 'flexible'] as const;

export type RemotePreference = (typeof remotePreferences)[number];

export interface UserProfileRecord {
  id: string;
  fullName: string;
  headline: string | null;
  summary: string | null;
  skills: string[];
  yearsOfExperience: number | null;
  workAuthorization: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobPreferenceRecord {
  id: string;
  userProfileId: string;
  desiredTitles: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  employmentTypes: string[];
  salaryMin: number | null;
  salaryCurrency: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
