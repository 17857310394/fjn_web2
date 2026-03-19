import { Category, Project, Language } from './types';
import { loadProjectsFromMarkdown } from './src/content/mdLoader';

export const CATEGORY_LABELS: Record<Language, Record<string, string>> = {
  zh: {
    'All': '全部',
    [Category.GAME]: '游戏开发',
    [Category.ARTICLE]: '策划案',
    [Category.DEV]: '应用开发'
  }
};

const PROJECTS_MD: Project[] = loadProjectsFromMarkdown();
export const PROJECTS: Record<Language, Project[]> = {
  zh: PROJECTS_MD
};
