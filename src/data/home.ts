import { Language, Category } from '../../types';

export interface HeroItem {
  text: string;
  annotation: string;
  category: Category | null;
}

export interface HomeContent {
  heroItems: HeroItem[];
}

export const HOME_DATA: Record<Language, HomeContent> = {
  zh: {
    heroItems: [
      { text: "游戏开发", annotation: "", category: Category.GAME }, // category is kept as VIDEO but UI will split
      { text: "策划案", annotation: "", category: Category.ARTICLE },
      { text: "应用开发", annotation: "", category: Category.DEV },
    ],
  }
};
