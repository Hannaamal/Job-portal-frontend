export type ResumeValue =
  | { url: string; uploadedAt: string }
  | File
  | null;

export type AvatarValue = string | File | null;

export interface ProfileForm {
  phone?: string;
  location?: string;
  title?: string;
  summary?: string;
  experienceLevel?: string;
  skills: string[];
  education: any[];
  experience: any[];
  avatar: AvatarValue;
  resume?: ResumeValue;
}

