import { Language } from '../../types';

export interface PortfolioPageContent {
  title: string;
}

export const PORTFOLIO_PAGE_DATA: Record<Language, PortfolioPageContent> = {
  zh: {
    title: '作品',
  }
};
