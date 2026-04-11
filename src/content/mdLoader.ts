import { Project, Category } from '../../types';

type RawMap = Record<string, string>;

interface FrontmatterResult {
  data: any;
  body: string;
}

function parseFrontmatter(raw: string): FrontmatterResult {
  const fmStart = raw.indexOf('---');
  if (fmStart !== 0) return { data: {}, body: raw };
  const fmEnd = raw.indexOf('\n---', fmStart + 3);
  if (fmEnd === -1) return { data: {}, body: raw };
  const header = raw.slice(fmStart + 3, fmEnd).trim();
  const body = raw.slice(fmEnd + 4).trim();

  const data: any = {};
  let currentSection: string | null = null;
  let currentListKey: string | null = null;

  const lines = header.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;

    // Check if this line starts with whitespace (indicating a list item or nested content)
    const isIndented = line.startsWith(' ') || line.startsWith('\t');
    
    if (trimmed.endsWith(':') && !trimmed.startsWith('- ')) {
      const key = trimmed.slice(0, -1);
      if (key === 'common' || key === 'zh') {
        currentSection = key;
        data[currentSection] = data[currentSection] || {};
        currentListKey = null;
        continue;
      }
      // Check if next lines are indented (list items or single value)
      const nextLine = lines[i + 1];
      if (nextLine && (nextLine.startsWith('  ') || nextLine.startsWith('\t'))) {
        const nextLineTrimmed = nextLine.trim();
        // Check if next line starts with - (YAML list item)
        if (nextLineTrimmed.startsWith('- ')) {
          // This is a list key
          if (currentSection) {
            data[currentSection][key] = data[currentSection][key] || [];
          } else {
            data[key] = data[key] || [];
          }
          currentListKey = key;
        } else {
          // This is a single indented value
          if (currentSection) {
            data[currentSection][key] = nextLineTrimmed;
          } else {
            data[key] = nextLineTrimmed;
          }
          currentListKey = null;
          i++; // Skip the value line
        }
      } else {
        currentSection = null;
        data[key] = data[key] ?? {};
        currentListKey = null;
      }
      continue;
    }

    // Handle list items (both with and without - prefix)
    if (isIndented && currentListKey) {
      const itemValue = trimmed.replace(/^-\s*/, ''); // Remove leading - if present
      if (itemValue) {
        if (currentSection) {
          data[currentSection][currentListKey].push(itemValue);
        } else {
          data[currentListKey].push(itemValue);
        }
      }
      continue;
    }

    if (trimmed.startsWith('- ')) {
      if (currentListKey) {
        if (currentSection) {
          data[currentSection][currentListKey].push(trimmed.slice(2));
        } else {
          data[currentListKey].push(trimmed.slice(2));
        }
        continue;
      }
    }

    const idx = trimmed.indexOf(':');
    if (idx > 0) {
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      if (currentSection) {
        if (data[currentSection][key] === undefined) {
          data[currentSection][key] = value;
        }
        // If value is empty, check if next lines are list items
        if (value === '') {
          const nextLine = lines[i + 1];
          if (nextLine && (nextLine.startsWith('  ') || nextLine.startsWith('\t'))) {
            data[currentSection][key] = [];
            currentListKey = key;
          }
        }
      } else {
        if (data[key] === undefined) {
          data[key] = value;
        }
        if (value === '') {
          const nextLine = lines[i + 1];
          if (nextLine && (nextLine.startsWith('  ') || nextLine.startsWith('\t'))) {
            data[key] = [];
            currentListKey = key;
          }
        }
      }
    }
  }

  return { data, body };
}

function mapCategory(value: string): Category {
  switch (value) {
    case Category.ALL: return Category.ALL;
    case Category.GAME: return Category.GAME;
    case Category.ARTICLE: return Category.ARTICLE;
    case Category.DEV: return Category.DEV;
    default:
      return Category.ALL;
  }
}

export function loadProjectsFromMarkdown(): Project[] {
  const modules = import.meta.glob('/src/content/projects/**/*.md', { query: '?raw', import: 'default', eager: true }) as RawMap;
  const results: Project[] = [];
  for (const path in modules) {
    const raw = modules[path];
    const { data, body } = parseFrontmatter(raw);
    if (!data?.id || !data?.common || !data?.zh) continue;

    const common = data.common;
    const zh = data.zh;

    const project: Project = {
      id: String(data.id), // 全站唯一 ID，用于列表 key / 弹窗定位 / 摄影图库映射等
      title: String(zh.title || ''), // 项目标题（本地化字段，当前仅 zh）
      subtitle: String(zh.subtitle || ''), // 项目副标题（用于卡片/详情头部展示）
      category: mapCategory(String(common.category || Category.ALL)), // 分类（frontmatter 可写中文或枚举值，这里统一映射成 Category）
      description: String(zh.description || ''), // 一句话/短描述（卡片摘要与详情介绍）
      role: String(zh.role || ''), // 角色/身份（详情页“分工与职责”标题）
      image: String(common.image || ''), // 封面图（用于卡片与详情媒体区的 fallback）
      videoUrl: common.videoUrl || undefined, // 本地/外链 mp4，详情媒体区 video 渲染
      bilibiliId: common.bilibiliId || undefined, // B 站 BV 号，详情媒体区 iframe 播放
      figmaUrl: common.figmaUrl || undefined, // Figma 链接，详情媒体区 iframe embed
      gallery: common.gallery || undefined, // 图集（用于摄影/设计等多图展示；摄影也可能回退到 PHOTOGRAPHY_GALLERY）
      externalLink: common.externalLink || undefined, // 备用外链（当前组件未用，可扩展）
      tags: Array.isArray(zh.tags) ? zh.tags : (zh.tags ? [zh.tags] : []), // 标签数组（详情页 Tags 区域）
      concept: zh.concept || undefined, // “设计意图 / 创意陈述”段落
      roleDetail: zh.roleDetail || undefined, // 角色的补充说明（职责细节）
      awards: zh.awards || undefined, // 获奖信息数组（详情页“获奖情况”列表）
      websiteUrl: common.websiteUrl || undefined, // Demo/在线预览链接（详情页 Links 区域）
      githubUrl: common.githubUrl || undefined, // GitHub 仓库链接（详情页 Links 区域）
      icon: common.icon || undefined, // Dev 项目图标名（用于卡片图标展示）
      content: body || undefined, // Markdown 正文（frontmatter 之后的内容，用于站内正文渲染）
      fullscreen: common.fullscreen || false
    };
    results.push(project);
  }
  return results;
}
