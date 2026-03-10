import { Language, Experience, HonorsData } from '../../types';

export interface EducationPageContent {
  title: string;
  about: string;
  openToWork: string;
  viewHonorsLabel: string;
  honorsTitle: string;
  competitionsTitle: string;
  scholarshipsLabel: string;
  titlesLabel: string;
  experiences: Experience[];
  honors: HonorsData;
}

export const EDUCATION_DATA: Record<Language, EducationPageContent> = {
  zh: {
    title: "教育经历",
    about: "A brief introduction about your educational background and passions.",
    openToWork: "边学边做+等待实习",
    viewHonorsLabel: "查看在校荣誉",
    honorsTitle: "在校荣誉",
    competitionsTitle: "竞赛奖项",
    scholarshipsLabel: "奖学金",
    titlesLabel: "荣誉称号",
    experiences: [
      {
        id: '1',
        year: '20XX - Present',
        title: '学位 / 专业',
        institution: '你的大学名称',
        description: '关于你学习内容的简短描述。',
        type: 'education'
      }
    ],
    honors: {
      scholarships: ["示例奖学金"],
      titles: ["示例荣誉称号"],
      competitions: [
        {
          level: "国家级",
          awards: ["一等奖 | 示例竞赛名称"]
        }
      ]
    }
  },
  en: {
    title: "Education",
    about: "A brief introduction about your educational background and passions.",
    openToWork: "Learning by Doing + Seeking Internship",
    viewHonorsLabel: "View Honors & Awards",
    honorsTitle: "Honors & Awards",
    competitionsTitle: "Competition Awards",
    scholarshipsLabel: "Scholarships",
    titlesLabel: "Honorary Titles",
    experiences: [
      {
        id: '1',
        year: '20XX - Present',
        title: 'Degree / Major',
        institution: 'Your University',
        description: 'Brief description of your studies.',
        type: 'education'
      }
    ],
    honors: {
      scholarships: ["Example Scholarship"],
      titles: ["Example Title"],
      competitions: [
        {
          level: "National",
          awards: ["1st Prize | Example Competition"]
        }
      ]
    }
  }
};