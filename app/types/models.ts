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
  status: "done" | "not";
  coverBase64: string | null;
  coverThumb: string;
  images?: string[];
  techStack: string[];
  projectUrl: string;
  repoUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  hasSeparateImage?: boolean;
  createdAt?: any;
  updatedAt?: any;
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
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  iconBase64: string;
  level: number;
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

export interface Certificate {
  id?: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string;
  credentialUrl: string;
  imageBase64: string;
  isFeatured: boolean;
}
