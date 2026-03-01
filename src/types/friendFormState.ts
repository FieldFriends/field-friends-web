import type { ProfileSubmission } from '../../shared/schemas/profileSchema';

export interface FriendFormState {
    name: string;
    age: number | null;
    gender: ProfileSubmission['gender'] | null;
    affiliation: ProfileSubmission['affiliation'] | null;
    social_energy: ProfileSubmission['social_energy'] | null;
    interests: string;
    activities: string;
    introduction: string;
    blocked_emails: string[];
}