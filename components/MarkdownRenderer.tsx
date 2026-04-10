import React from 'react';

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
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:opacity-90 transition-opacity"
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
        nodes.push(
          <a
            key={`${keyPrefix}-link-${keyIndex++}`}
            href={href}
            target="_blank"
            rel="noreferrer"
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

function renderHeading(level: number, content: string, key: string) {
  const base = 'font-black text-black dark:text-white leading-tight';
  const cls =
    level === 1 ? `text-3xl md:text-4xl ${base}` :
    level === 2 ? `text-2xl md:text-3xl ${base}` :
    level === 3 ? `text-xl md:text-2xl ${base}` :
    level === 4 ? `text-lg md:text-xl ${base}` :
    level === 5 ? `text-base md:text-lg ${base}` :
    `text-sm md:text-base ${base}`;

  const Tag = (`h${level}` as keyof JSX.IntrinsicElements);
  return <Tag key={key} className={cls}>{parseInline(content, key)}</Tag>;
}

export interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
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
      blocks.push(renderHeading(level, text, nextKey('h')));
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
            className="w-full rounded-2xl border border-gray-200 dark:border-gray-800"
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
    <div className="w-full flex flex-col gap-5">
      {blocks}
    </div>
  );
};

