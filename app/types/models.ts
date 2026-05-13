// types/models.ts
import type { Timestamp } from "firebase/firestore";

export interface Profile {
  name: string;
  title: string;
  bio: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  resumeUrl: string;
  avatarBase64: string;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverBase64: string | null;
  coverThumb: string;
  techStack: string[];
  projectUrl: string;
  repoUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  orderIndex: number;
  hasSeparateImage?: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  logoBase64: string;
  companyUrl: string;
  orderIndex: number;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  iconBase64: string;
  level: number;
  orderIndex: number;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company: string;
  avatarBase64: string;
  content: string;
  isPublished: boolean;
  orderIndex: number;
}
