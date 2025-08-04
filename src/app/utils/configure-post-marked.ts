import hljs from 'highlight.js';
import * as marked from 'marked';

import { escapeHtml } from '@/app/utils/escapeHtml';

const renderCheckbox = ({ checked }: marked.Tokens.Checkbox): string => {
  return `<input type="checkbox" disabled ${checked ? 'checked' : ''}>`;
};

const renderDel = ({ tokens }: marked.Tokens.Del): string => {
  return `<s class="custom-del">${tokens.map((t) => t.raw).join('')}</s>`;
};

const renderHr = (): string => {
  return '<hr class="custom-hr">';
};

const renderEm = ({ tokens }: marked.Tokens.Em): string => {
  return `<i class="custom-em">${tokens.map((t) => t.raw).join('')}</i>`;
};

const renderHeading = ({ depth, tokens }: marked.Tokens.Heading): string => {
  const text = marked.parseInline(tokens.map((t) => t.raw).join(''));
  if (typeof text === 'string') {
    return `<h${depth} id="heading-${depth}-${tokens[0]?.raw || 'section'}" class="custom-heading">${text}</h${depth}>`;
  }
  return '';
};

const renderLink = ({ href, title, tokens }: marked.Tokens.Link): string => {
  const text = tokens.map((t) => t.raw).join('');
  const target = href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${href}" title="${title}"${target}>${text}</a>`;
};

const renderCodeBlock = (token: marked.Tokens.Code): string => {
  const validLanguage = token.lang && hljs.getLanguage(token.lang) ? token.lang : 'plaintext';
  return `
    <pre>
      <code class="hljs ${token.lang ?? 'text'}">
        ${hljs.highlight(token.text, { language: validLanguage }).value}
      </code>
    </pre>
  `;
};

const renderHtml = (token: marked.Tokens.HTML | marked.Tokens.Tag): string => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = token.raw;
  const textContent = tempDiv.textContent ?? '';
  return escapeHtml(textContent);
};

const renderImage = (token: marked.Tokens.Image): string => {
  return `
    <img
      style="max-width: 100%; height: auto;"
      src="${token.href}"
      alt="${token.text}"
      title="${token.title ?? token.text}""
    />
  `;
};
const renderListitem = (item: marked.Tokens.ListItem): string => {
  const text = marked.parseInline(item.tokens.map((t) => t.raw).join(''));
  if (typeof text === 'string') {
    if (item.task) {
      return `<li class="custom-list-item">${renderCheckbox({
        checked: item.checked ?? false,
      })} ${text}</li>`;
    }
    return `<li class="custom-list-item">${text}</li>`;
  }
  return '';
};

const renderList = (token: marked.Tokens.List): string => {
  const tag = token.ordered ? 'ol' : 'ul';
  const items = token.items.map((item) => renderListitem(item)).join('\n');
  return `<${tag} class="custom-list">${items}</${tag}>`;
};

const renderStrong = ({ tokens }: marked.Tokens.Strong): string => {
  return `<b class="custom-strong">${tokens.map((t) => t.raw).join('')}</b>`;
};

const renderParagraph = (tokens: marked.Tokens.Paragraph): string => {
  let result = '';
  tokens.tokens.forEach((token) => {
    switch (token.type) {
      case 'codespan':
        result = result + ` <code>${String(token.text).replace(/`/g, '')}</code> `;

        break;
      case 'image':
        result =
          result +
          renderImage({
            href: String(token.href),
            raw: token.raw,
            text: String(token.text),
            title: String(token.title),
            tokens: token.tokens ?? [],
            type: 'image',
          });
        break;
      case 'link':
        result =
          result +
          renderLink({
            href: String(token.href),
            raw: token.raw,
            text: String(token.text),
            title: String(token.title),
            tokens: token.tokens ?? [],
            type: 'link',
          });
        break;
      case 'text':
        result = result + token.raw;
        break;
    }
  });

  return `<p class="custom-paragraph">${result}</p>`;
};

export const configurePostMarked = (): void => {
  marked.use({
    breaks: true,
    gfm: true,
    pedantic: false,
    renderer: {
      checkbox: renderCheckbox,
      code: renderCodeBlock,
      del: renderDel,
      em: renderEm,
      heading: renderHeading,
      hr: renderHr,
      html: renderHtml,
      image: renderImage,
      link: renderLink,
      list: renderList,
      listitem: renderListitem,
      paragraph: renderParagraph,
      space: (token: marked.Tokens.Space) => {
        return token.raw.replace(/\n/, '<br>');
      },
      strong: renderStrong,
    },
  });
};
