import React, { useState, useEffect, useRef } from 'react';

interface NavItem {
  id: string;
  title: string;
  level: number;
  children?: NavItem[];
  parentId?: string;
}

const Navbar: React.FC<{
  navItems: NavItem[];
  activeId: string;
  onNavClick: (id: string) => void;
  isMobile: boolean;
  onCloseMobile: () => void;
}> = ({ navItems, activeId, onNavClick, isMobile, onCloseMobile }) => {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const isActive = (id: string) => {
    return activeId === id;
  };

  const isExpanded = (id: string) => {
    return expanded.has(id);
  };

  const hasChildren = (item: NavItem) => {
    return item.children && item.children.length > 0;
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const paddingLeft = depth * 16;
    const isActiveItem = isActive(item.id);
    const itemExpanded = isExpanded(item.id);
    const itemHasChildren = hasChildren(item);

    return (
      <div key={item.id} className="relative">
        <button
          className={`flex items-center w-full text-left py-2 px-4 rounded-lg transition-colors duration-200 ${isActiveItem ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => {
            // 总是调用 onNavClick 函数，实现跳转功能
            onNavClick(item.id);
            // 如果有子项，则切换展开/折叠状态
            if (itemHasChildren) {
              toggleExpand(item.id);
            }
            // 如果是移动端，则关闭导航抽屉
            if (isMobile) {
              onCloseMobile();
            }
          }}
        >
          <span className="flex-1 truncate">{item.title}</span>
          {itemHasChildren && (
            <span className={`ml-2 transition-transform duration-200 ${itemExpanded ? 'transform rotate-90' : ''}`}>
              ▶
            </span>
          )}
        </button>
        {itemHasChildren && itemExpanded && (
          <div className="ml-4 mt-1">
            {item.children?.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white dark:bg-black' : 'sticky top-4'}`}>
      {isMobile && (
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">目录</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onCloseMobile}
          >
            ×
          </button>
        </div>
      )}
      <div className={`overflow-y-auto ${isMobile ? 'h-[calc(100vh-64px)] p-4' : 'max-h-[calc(100vh-8rem)]'}`}>
        {navItems.map(item => renderNavItem(item))}
      </div>
    </div>
  );
};

type InlineNode = string | React.ReactElement;

function parseInline(text: string, keyPrefix: string): InlineNode[] {
  const nodes: InlineNode[] = [];

  const parts = text.split(/(`[^`]+`)/g);
  let keyIndex = 0;

  for (const part of parts) {
    if (!part) continue;

    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${keyIndex++}`}
          className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono text-gray-800 dark:text-gray-200"
        >
          {part.slice(1, -1)}
        </code>
      );
      continue;
    }

    let rest = part;
    while (rest.length > 0) {
      // 尝试匹配图片链接格式 [![alt text](image-url)](link-url)
      const fullLinkMatch = rest.match(/\[(!\[[^\]]*\]\([^)]+\))\]\(([^)]+)\)/);
      if (fullLinkMatch && fullLinkMatch.index !== undefined) {
        // 处理图片链接格式
        const before = rest.slice(0, fullLinkMatch.index);
        if (before) nodes.push(...parseEmphasis(before, `${keyPrefix}-em-${keyIndex++}`));
        
        const imgMatch = fullLinkMatch[1].match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          const href = fullLinkMatch[2];
          nodes.push(
            <a
              key={`${keyPrefix}-link-img-${keyIndex++}`}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                referrerPolicy="no-referrer"
                className="max-w-full rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
                decoding="async"
              />
            </a>
          );
        }
        rest = rest.slice(fullLinkMatch.index + fullLinkMatch[0].length);
        continue;
      }

      // 尝试匹配普通链接格式 [text](link)
      const linkMatch = rest.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!linkMatch || linkMatch.index === undefined) {
        nodes.push(...parseEmphasis(rest, `${keyPrefix}-em-${keyIndex++}`));
        break;
      }

      const before = rest.slice(0, linkMatch.index);
      if (before) nodes.push(...parseEmphasis(before, `${keyPrefix}-em-${keyIndex++}`));

      const label = linkMatch[1];
      const href = linkMatch[2];
      
      // 检查标签是否包含图片
      const imgMatch = label.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        // 处理图片作为链接的情况
        nodes.push(
          <a
            key={`${keyPrefix}-link-img-${keyIndex++}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="block"
          >
            <img
              src={imgMatch[2]}
              alt={imgMatch[1]}
              referrerPolicy="no-referrer"
              className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              decoding="async"
            />
          </a>
        );
      } else {
        // 处理普通链接
        const isInternalAnchor = href.startsWith('#');
        nodes.push(
          <a
            key={`${keyPrefix}-link-${keyIndex++}`}
            href={href}
            target={isInternalAnchor ? '_self' : '_blank'}
            rel={isInternalAnchor ? undefined : 'noreferrer'}
            className="font-bold underline decoration-2 underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            {parseInline(label, `${keyPrefix}-link-content-${keyIndex++}`)}
          </a>
        );
      }

      rest = rest.slice(linkMatch.index + linkMatch[0].length);
    }
  }

  return nodes;
}

function parseEmphasis(text: string, keyPrefix: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let rest = text;
  let keyIndex = 0;

  while (rest.length > 0) {
    const boldMatch = rest.match(/\*\*([^*]+)\*\*/);
    const italicMatch = rest.match(/\*([^*]+)\*/);

    const candidates: Array<{ kind: 'bold' | 'italic'; match: RegExpMatchArray }> = [];
    if (boldMatch && boldMatch.index !== undefined) candidates.push({ kind: 'bold', match: boldMatch });
    if (italicMatch && italicMatch.index !== undefined) candidates.push({ kind: 'italic', match: italicMatch });

    if (candidates.length === 0) {
      nodes.push(rest);
      break;
    }

    candidates.sort((a, b) => (a.match.index ?? 0) - (b.match.index ?? 0));
    const picked = candidates[0];
    const idx = picked.match.index ?? 0;

    const before = rest.slice(0, idx);
    if (before) nodes.push(before);

    const content = picked.match[1] ?? '';
    if (picked.kind === 'bold') {
      nodes.push(
        <strong key={`${keyPrefix}-b-${keyIndex++}`} className="font-black">
          {content}
        </strong>
      );
    } else {
      nodes.push(
        <em key={`${keyPrefix}-i-${keyIndex++}`} className="italic">
          {content}
        </em>
      );
    }

    rest = rest.slice(idx + picked.match[0].length);
  }

  return nodes;
}

function isHr(line: string): boolean {
  const t = line.trim();
  return t === '---' || t === '***' || t === '___';
}

function headingLevel(line: string): number | null {
  const m = line.match(/^(#{1,6})\s+(.+)$/);
  if (!m) return null;
  return m[1].length;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5\-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function renderHeading(level: number, content: string, key: string) {
  const base = 'font-black text-black dark:text-white leading-tight';
  const cls =
    level === 1 ? `text-4xl md:text-5xl ${base}` :
    level === 2 ? `text-3xl md:text-4xl ${base}` :
    level === 3 ? `text-2xl md:text-3xl ${base}` :
    level === 4 ? `text-xl md:text-2xl ${base}` :
    level === 5 ? `text-lg md:text-xl ${base}` :
    `text-base md:text-lg ${base}`;

  const Tag = (`h${level}` as keyof JSX.IntrinsicElements);
  const id = slugify(content);
  return <Tag key={key} className={cls} id={id}>{parseInline(content, key)}</Tag>;
}

export interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMobileNav, setShowMobileNav] = useState<boolean>(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const headingRefs = useRef<Record<string, HTMLElement | null>>({});

  // 提取文档中的标题，构建导航项树
  useEffect(() => {
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    const items: NavItem[] = [];
    const stack: NavItem[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      const level = headingLevel(trimmed);
      if (level) {
        const text = trimmed.replace(/^#{1,6}\s+/, '');
        const id = slugify(text);
        const newItem: NavItem = { id, title: text, level };

        // 找到父节点
        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        if (stack.length > 0) {
          const parent = stack[stack.length - 1];
          newItem.parentId = parent.id;
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(newItem);
        } else {
          items.push(newItem);
        }

        stack.push(newItem);
      }
    }

    setNavItems(items);
  }, [content]);

  // 处理滚动事件，自动定位到当前阅读章节
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const headings = Object.entries(headingRefs.current);
      let currentId = '';

      for (const [id, element] of headings) {
        if (element && element.offsetTop <= scrollPosition) {
          currentId = id;
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeId]);

  // 处理窗口大小变化，更新 isMobile 状态
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // 初始调用
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 处理导航点击
  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // 滚动后稍微调整位置，留出顶部空间
      setTimeout(() => {
        window.scrollBy(0, -80);
      }, 100);
      setActiveId(id);
    }
  };

  // 渲染标题，同时添加 ref
  const renderHeadingWithRef = (level: number, content: string, key: string) => {
    const id = slugify(content);
    const heading = renderHeading(level, content, key);
    
    // 为标题添加 ref
    return React.cloneElement(heading as React.ReactElement, {
      ref: (el: HTMLElement | null) => {
        headingRefs.current[id] = el;
      }
    });
  };

  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];

  let i = 0;
  let keyIndex = 0;
  const nextKey = (prefix: string) => `${prefix}-${keyIndex++}`;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const language = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push(
        <pre
          key={nextKey('code')}
          className="w-full overflow-x-auto rounded-2xl bg-black text-white p-5 md:p-6 text-sm font-mono border border-black/10 dark:border-white/10"
        >
          {language ? (
            <div className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">{language}</div>
          ) : null}
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      continue;
    }

    if (isHr(trimmed)) {
      blocks.push(<div key={nextKey('hr')} className="w-full h-px bg-gray-200 dark:bg-gray-700 my-6" />);
      i += 1;
      continue;
    }

    const level = headingLevel(trimmed);
    if (level) {
      const text = trimmed.replace(/^#{1,6}\s+/, '');
      blocks.push(renderHeadingWithRef(level, text, nextKey('h')));
      i += 1;
      continue;
    }

    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      blocks.push(
        <figure key={nextKey('img')} className="w-full">
          <img
            src={img[2]}
            alt={img[1]}
            referrerPolicy="no-referrer"
            className="max-w-full rounded-2xl border border-gray-200 dark:border-gray-800"
            loading="lazy"
            decoding="async"
          />
          {img[1] ? (
            <figcaption className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
              {img[1]}
            </figcaption>
          ) : null}
        </figure>
      );
      i += 1;
      continue;
    }

    if (trimmed.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().slice(2));
        i += 1;
      }
      blocks.push(
        <blockquote
          key={nextKey('quote')}
          className="border-l-4 border-black dark:border-white pl-5 py-1 text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-white/5 rounded-r-2xl"
        >
          <p className="text-base md:text-lg leading-relaxed font-medium">
            {parseInline(quoteLines.join(' '), nextKey('quote-inline'))}
          </p>
        </blockquote>
      );
      continue;
    }

    // 检查是否为列表项（考虑缩进）
    const listMatch = trimmed.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const parseList = (startIdx: number, baseIndent: number, depth: number = 0) => {
        const items: React.ReactNode[] = [];
        let j = startIdx;
        
        while (j < lines.length) {
          const line = lines[j];
          const t = line.trim();
          if (!t) {
            j += 1;
            continue;
          }
          
          const match = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
          if (!match) break;
          
          const indent = match[1].length;
          const marker = match[2];
          const content = match[3];
          
          // 如果缩进小于基础缩进，说明当前列表结束
          if (indent < baseIndent) break;
          
          // 如果缩进大于基础缩进，说明是嵌套列表
          if (indent > baseIndent) {
            // 递归解析嵌套列表
            const nestedList = parseList(j, indent, depth + 1);
            items.push(
              <li key={`${nextKey('li')}-${j}`} className="text-base md:text-lg leading-relaxed font-medium">
                {nestedList.items}
              </li>
            );
            j = nestedList.nextIdx;
            continue;
          }
          
          // 处理当前列表项
          items.push(
            <li key={`${nextKey('li')}-${j}`} className="text-base md:text-lg leading-relaxed font-medium py-1">
              {parseInline(content, `${nextKey('li-inline')}-${j}`)}
            </li>
          );
          
          j += 1;
        }
        
        // 根据深度生成不同的列表样式
        const isOrdered = /^\d+\.$/.test(listMatch[2]);
        let listClass = '';
        
        if (isOrdered) {
          listClass = 'list-decimal';
        } else {
          // 为不同深度的无序列表使用不同的标记
          const markers = ['list-disc', 'list-circle', 'list-square'];
          listClass = markers[depth % markers.length];
        }
        
        const ListTag = (isOrdered ? 'ol' : 'ul') as 'ol' | 'ul';
        const listElement = (
          <ListTag
            key={nextKey('list')}
            className={`${listClass} pl-6 space-y-2 text-gray-700 dark:text-gray-200`}
            style={{ marginBottom: '0.5rem' }}
          >
            {items}
          </ListTag>
        );
        
        return { items: listElement, nextIdx: j };
      };
      
      const baseIndent = listMatch[1].length;
      const { items, nextIdx } = parseList(i, baseIndent);
      
      blocks.push(items);
      
      i = nextIdx;
      continue;
    }

    // Check for table
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [trimmed];
      i += 1;
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i]);
        i += 1;
      }
      
      if (tableLines.length >= 2) {
        const headerRow = tableLines[0].split('|').map(cell => cell.trim()).filter(Boolean);
        const separatorRow = tableLines[1].split('|').map(cell => cell.trim()).filter(Boolean);
        const dataRows = tableLines.slice(2).map(row => row.split('|').map(cell => cell.trim()).filter(Boolean));
        
        blocks.push(
          <table key={nextKey('table')} className="w-full border-collapse">
            <thead>
              <tr>
                {headerRow.map((header, idx) => (
                  <th key={`${nextKey('th')}-${idx}`} className="border border-gray-200 dark:border-gray-800 px-4 py-2 text-left bg-gray-50 dark:bg-gray-900 font-bold">
                    {parseInline(header, `${nextKey('th-inline')}-${idx}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, rowIdx) => (
                <tr key={`${nextKey('tr')}-${rowIdx}`} className={rowIdx % 2 === 0 ? 'bg-white dark:bg-gray-950' : 'bg-gray-50 dark:bg-gray-900'}>
                  {row.map((cell, cellIdx) => (
                    <td key={`${nextKey('td')}-${rowIdx}-${cellIdx}`} className="border border-gray-200 dark:border-gray-800 px-4 py-2">
                      {parseInline(cell, `${nextKey('td-inline')}-${rowIdx}-${cellIdx}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
        continue;
      }
    }
    
    const paraLines: string[] = [trimmed];
    i += 1;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (t.startsWith('```')) break;
      if (headingLevel(t)) break;
      if (isHr(t)) break;
      if (t.startsWith('> ')) break;
      if (/^!\[([^\]]*)\]\(([^)]+)\)$/.test(t)) break;
      if (/^[-*]\s+/.test(t)) break;
      if (/^\d+\.\s+/.test(t)) break;
      if (t.startsWith('|')) break;
      paraLines.push(t);
      i += 1;
    }
    blocks.push(
      <p
        key={nextKey('p')}
        className="text-base md:text-lg leading-relaxed text-gray-700 dark:text-gray-200 font-medium"
      >
        {parseInline(paraLines.join(' '), nextKey('p-inline'))}
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* 侧边导航栏（桌面端） */}
      {!isMobile && (
        <div className="md:w-64 lg:w-72 shrink-0">
          <Navbar
            navItems={navItems}
            activeId={activeId}
            onNavClick={handleNavClick}
            isMobile={false}
            onCloseMobile={() => {}}
          />
        </div>
      )}

      {/* 移动端导航按钮 */}
      {isMobile && (
        <div className="fixed top-4 right-4 z-40">
          <button
            className="p-2 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg"
            onClick={() => setShowMobileNav(true)}
          >
            ☰
          </button>
        </div>
      )}

      {/* 移动端导航抽屉 */}
      {isMobile && showMobileNav && (
        <Navbar
          navItems={navItems}
          activeId={activeId}
          onNavClick={handleNavClick}
          isMobile={true}
          onCloseMobile={() => setShowMobileNav(false)}
        />
      )}

      {/* 主要内容 */}
      <div className="flex-1">
        <div className="w-full flex flex-col gap-5">
          {blocks}
        </div>
      </div>
    </div>
  );
};

