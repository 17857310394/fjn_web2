
export type Language = 'zh';

export enum Category {
  ALL = 'All',
  GAME = 'Game',
  ARTICLE = 'ARTICLE',
  DEV = 'Development'
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: Category;
  description: string;
  role: string;
  image: string; // URL placeholder (Cover/Thumbnail)
  videoUrl?: string; // URL to .mp4 file
  bilibiliId?: string; // Bilibili Video ID (e.g. BV1xx...)
  figmaUrl?: string; // Figma File URL
  gallery?: string[]; // Additional images (URLs)
  externalLink?: string; // External link (e.g. Bilibili, Behance)
  tags: string[];
  // New detailed fields
  concept?: string;
  roleDetail?: string;
  awards?: string[]; // Array of award strings

  websiteUrl?: string; // Online preview URL
  githubUrl?: string; // GitHub repository URL
  icon?: string; // Icon name for Dev projects
  content?: string;
}

export interface ProjectCommonFields {
  category: Category;
  image: string;
  videoUrl?: string;
  bilibiliId?: string;
  figmaUrl?: string;
  gallery?: string[];
  externalLink?: string;
  websiteUrl?: string;
  githubUrl?: string;
  icon?: string;
}

export interface ProjectLocalizedFields {
  title: string;
  subtitle: string;
  description: string;
  role: string;
  tags: string[];
  concept?: string;
  roleDetail?: string;
  awards?: string[];
}

export interface ProjectSource {
  id: string;
  common: ProjectCommonFields;
  zh: ProjectLocalizedFields;
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  institution: string;
  description: string;
  type: 'education' | 'work';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

export interface CompetitionGroup {
  level: string;
  awards: string[];
}

export interface HonorsData {
  scholarships: string[];
  titles: string[];
  competitions: CompetitionGroup[];
}
