# FJNLOO - Personal Website

一个以内容数据驱动的个人作品集网站，包含主页、作品集与联系页，以及内置音乐播放器与物理“爆炸”彩蛋。

## 技术栈

- 前端：React 19 + TypeScript 5 + Vite 6
- 样式：Tailwind CSS 3 + PostCSS + Autoprefixer（`darkMode: 'class'`）
- 动效/交互：CSS 动画 + View Transitions API（可用时启用）+ Matter.js 物理效果
- 图标：lucide-react
- 工具脚本：Node.js（CommonJS）+ sharp（图片压缩）
- 部署：GitHub Pages + GitHub Actions（构建产物 `dist/`）

## 核心功能

1. 顶部导航：主页 / 作品 / 联系三页切换，支持滚动状态样式变化
2. 作品集筛选：按分类过滤，支持从主页“标题点击”直接带筛选跳转
3. 项目详情弹窗：Portal 模态框展示作品详情（图片/视频/Bilibili/Figma/外链网站 iframe）
5. 主题系统：按时间自动切换深浅色；支持手动切换；使用 `localStorage` 持久化
6. 音乐播放器：播放列表、进度与音量控制、淡入淡出、首次交互提示（规避浏览器自动播放限制）
7. 彩蛋交互：触发后将页面元素转为物理刚体并可点击施加力，支持一键复原

## 目录结构

- `/components` - UI 组件（Sidebar/Hero/Portfolio/MusicPlayer 等）
- `/src/data` - 内容数据源（作品、摄影图库、音乐列表、联系方式等）
- `/src/content/projects` - 使用 Markdown 管理的内容（项目内容 `.md`）
- `/public` - 静态资源（包含 `/public/music` 音频与封面）
- `/scripts` - 辅助脚本（例如图片压缩、音乐条目生成）
- `App.tsx` - 应用入口组件（路由/状态/主题/彩蛋逻辑）
- `constants.ts` - 分类映射与数据聚合
- `types.ts` - TypeScript 类型与枚举
- `vite.config.ts` - Vite 配置（含 GitHub Pages 的 `base` 配置）

## 使用 Markdown 配置内容

站点支持通过 Markdown 前言区（frontmatter）配置项目数据。若 `/src/content/projects` 下存在 `.md` 文件，则优先使用其中的内容；否则回退到 `/src/data` 内置示例数据。

示例文件：

- 项目示例：[src/content/projects/sample-project.md](file:///e:/lzy/_Tools/ai_test/fjn_web2/src/content/projects/sample-project.md)

前言区字段约定：

- 项目
  - 根级：`id`
  - `common`：`category`、`image`、`videoUrl`、`bilibiliId`、`figmaUrl`、`gallery[]`、`externalLink`、`websiteUrl`、`githubUrl`、`icon`
  - `zh`：`title`、`subtitle`、`description`、`role`、`tags[]`、`concept`、`roleDetail`、`awards[]`

注意：
- 当前实现解析基本 key-value 与简单数组（`- item`）语法，满足本项目字段需求；复杂嵌套可后续扩展。
- 项目 Markdown 正文（frontmatter 之后的内容）会在项目详情弹窗中渲染展示。

## 开发与构建

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## 部署

- 目标平台：GitHub Pages
- 自动化：推送到 `main` 分支会触发 GitHub Actions 构建并发布（产物目录：`dist/`）
- 路径前缀：生产环境 `base` 为 `/LuN3cy/`（见 `vite.config.ts`），用于适配 Pages 子路径部署

## 设计风格

- 视觉：黑白高对比、极简排版、强调大字号与粗字重
- 圆角：大量使用 `rounded-[2rem]` 的卡片/弹窗风格
- 字体：`"OPPO Sans" / Inter / PingFang SC / Microsoft YaHei`
- 暗色模式：通过 `html.dark` 类控制，并配合 Tailwind `dark:` 变体
