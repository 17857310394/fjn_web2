---
id: sample-md-project
common:
  category: Article
  image: https://www.figma.com/file/cRFVFLypB290MP6ImMgiPd/thumbnail?ver=thumbnails/86fca228-9e5a-4b50-bc1e-8bb31f33edb9'
#   websiteUrl: https://lun3cy.github.io/LUNA-Badge/
  githubUrl: https://github.com/LuN3cy/WeChat-MsgAnalysis
  # videoUrl: /videos/video_0.mp4
zh: 
  title: 通过 Markdown 配置的示例项目
  subtitle: 示例副标题
  description: 使用 md 前言区（frontmatter）来配置项目的元数据与文案。
  role: 角色
  tags:
    - 标签A
    - 标签B
  awards:
    - 示例奖项
  concept: 这是一个通过 Markdown 管理内容的示例。
  roleDetail: 负责整体设计与开发。
---

项目的正文部分可以写更长的介绍、设计笔记或媒体链接说明。当前站点使用前言区来读取必要字段，正文可作为详情展示的富文本来源（未来可以扩展为渲染 markdown 正文）。

## 1. 段落与行内语法

支持 **加粗**、*斜体*、行内代码 `npm run dev`，以及链接：[打开一个示例链接](https://example.com)。

## 2. 列表

- 列表项 A
- 列表项 B（包含行内代码 `const x = 1`）
- 列表项 C（包含链接：[GitHub](https://github.com)）

1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

## 3. 引用

> 这是一段引用文本，用于强调观点或摘录。
> 引用也支持多行拼接显示。

## 4. 代码块

```ts
type Article = {
  id: string;
  title: string;
  content?: string;
};

console.log('Hello Markdown');
```

## 5. 图片

![占位图（用于测试图片渲染）](https://www.figma.com/file/cRFVFLypB290MP6ImMgiPd/thumbnail?ver=thumbnails/86fca228-9e5a-4b50-bc1e-8bb31f33edb9)

## 6. 最后

如果你希望支持表格、任务列表、脚注、嵌套列表、代码高亮主题等，也可以继续扩展渲染能力。
[下载思维导图 PDF](/files/mindmap.png)
