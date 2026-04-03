import { Language } from '../../types';

export interface SocialLinks {
  bilibili: string;
}

export interface ContactContent {
  baseLabel: string;
  locationValue: string;
  contactLabel: string;
  mindmapLink: string;
  emailMeLabel: string;
  email: string;
  hello: string;
  intro: string;
  socials: SocialLinks;
  tooltip?: string;
  githubLabel: string;
}

export const CONTACT_DATA: Record<Language, ContactContent> = {
  zh: {
    baseLabel: "BASE",
    locationValue: "浙江-杭州",
    contactLabel: "取得联系",
    emailMeLabel: "邮箱",
    mindmapLink: "/files/mindmap.pdf",
    email: "840224026@qq.com",
    hello: "你好 ;-)",
    intro: "欢迎探讨与合作。",
    socials: {
      bilibili: "Da大"
    },
    githubLabel: "GitHub",
  }
};
