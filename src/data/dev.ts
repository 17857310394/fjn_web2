import { Category, ProjectSource } from '../../types';

export const DEV_DATA: ProjectSource[] = [
  {
    id: 'dev1',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'message-circle',
      websiteUrl: 'https://wechat-msganalysis-krgkfhfdcxwmtwst4jc4bw.streamlit.app/',
      githubUrl: 'https://github.com/LuN3cy/WeChat-MsgAnalysis'
    },
    zh: {
      title: '微信聊天记录数据分析',
      subtitle: 'Python / Streamlit',
      description: '对json格式的聊天记录进行完整的分析，包含时段、内容和互动模式。',
      role: '全栈开发',
      tags: ['Python', 'Streamlit', '数据分析'],
      roleDetail: "独立完成后端数据处理逻辑与前端可视化界面开发。"
    }
  },
  {
    id: 'dev2',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'id-card',
      websiteUrl: 'https://lun3cy.github.io/LUNA-Badge/',
      githubUrl: 'https://github.com/LuN3cy/LUNA-Badge'
    },
    zh: {
      title: '工牌生成器',
      subtitle: 'React / Tailwind',
      description: '具有设计感的自定义工牌生成应用。',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS'],
      roleDetail: "You`re absolutely RIGHT!"
    }
  },
  {
    id: 'dev3',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'file-text',
      websiteUrl: 'https://lun3cy.github.io/Md2Design/',
      githubUrl: 'https://github.com/LuN3cy/Md2Design'
    },
    zh: {
      title: 'Md2Design',
      subtitle: 'React 19 / Tailwind v4',
      description: '将 Markdown 内容快速转换为适合社媒宣发的美观卡片。支持自动分页、浮动图层、自定义字体与样式，以及一键导出 PNG/JPG。',
      role: 'vibe builder',
      tags: ['React 19', 'Tailwind v4', 'Framer Motion', 'Zustand', '工具'],
      roleDetail: "基于 Gemini 3 Pro 与 Trae IDE 开发。"
    }
  },
  {
    id: 'dev4',
    common: {
      category: Category.DEV,
      image: '', // Placeholder
      icon: 'film',
      websiteUrl: 'https://lun3cy.github.io/CineViz/',
      githubUrl: 'https://github.com/LuN3cy/CineViz'
    },
    zh: {
      title: 'CineViz',
      subtitle: 'React / Tailwind',
      description: '基于计量电影学的视频节奏与视觉分析工具。',
      role: 'vibe builder',
      tags: ['React', 'Tailwind CSS', 'TypeScript'],
      roleDetail: "请理解我的意思，再生成一次，不要修改前面的代码"
    }
  }
];
