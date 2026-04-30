/**
 * @file searchClient.ts
 * @description Client-side search logic powered by Pagefind headless API.
 * Isolated into a separate module to keep Astro pages focused on structure.
 * Implements client-side pagination (Prev | Page X of Y | Next) matching the design system.
 */
import { PAGE_CONFIG } from '../config/ui';
import { formatLabel } from '../utils/formatters';

const initPagefind = async (): Promise<void> => {
  const DOM = {
    input: document.getElementById('custom-search-input') as HTMLInputElement,
    resultsContainer: document.getElementById('custom-search-results'),
    template: document.getElementById('search-result-template') as HTMLTemplateElement,
    dateTemplate: document.getElementById('search-date-template') as HTMLTemplateElement,
    tagTemplate: document.getElementById('search-tag-template') as HTMLTemplateElement,
    paginationContainer: document.getElementById('search-pagination-container'),
    clearBtn: document.getElementById('clear-search-btn'),
    searchIcon: document.getElementById('search-active-icon'),
    emptyTemplate: document.getElementById('search-empty-template') as HTMLTemplateElement,
  };

  if (!DOM.input || !DOM.resultsContainer || !DOM.template || !DOM.paginationContainer) return;

  let pagefind: any;
  let currentResults: any[] = [];
  let currentPage = 0;
  let totalPages = 0;
  let debounceTimer: number;
  let currentSearchId = 0;
  let currentQuery = '';

  try {
    const pagefindPath = '/pagefind/pagefind.js';
    pagefind = await import(/* @vite-ignore */ pagefindPath);
    await pagefind.options({ excerptLength: 15 });
  } catch {
    return;
  }

  const renderResults = async (page: number) => {
    const start = page * PAGE_CONFIG.notesPerPage;
    const end = start + PAGE_CONFIG.notesPerPage;
    const paginatedSlice = currentResults.slice(start, end);

    const resultsData = await Promise.all(paginatedSlice.map((r: any) => r.data()));

    DOM.resultsContainer.innerHTML = '';

    for (const post of resultsData) {
      const clone = DOM.template.content.cloneNode(true) as DocumentFragment;
      const article = clone.querySelector('article')!;
      const link = clone.querySelector('.search-result-title') as HTMLAnchorElement;
      const excerpt = clone.querySelector('.search-result-excerpt') as HTMLElement;
      const metaContainer = clone.querySelector('.search-result-meta') as HTMLElement;

      link.href = post.url;
      link.textContent = post.meta.title ?? '';

      if (currentQuery.trim().length === 0 && post.meta.description) {
        excerpt.textContent = post.meta.description;
      } else {
        excerpt.innerHTML = post.excerpt || post.meta.description || '';
      }

      if (post.meta.date && DOM.dateTemplate) {
        const dateClone = DOM.dateTemplate.content.cloneNode(true) as DocumentFragment;
        const timeEl = dateClone.querySelector('time')!;
        timeEl.textContent = post.meta.date;
        metaContainer.insertBefore(dateClone, metaContainer.firstChild);
      }

      const metaTags = (post.filters && post.filters.tag) || post.meta.tag || post.meta.tags;
      if (metaTags && DOM.tagTemplate) {
        const tagContainer = clone.querySelector('.search-result-tags') as HTMLUListElement;
        const tags = Array.isArray(metaTags) ? metaTags : [metaTags];
        for (const t of tags) {
          const tagClone = DOM.tagTemplate.content.cloneNode(true) as DocumentFragment;
          const tagEl = tagClone.querySelector('a')!;
          tagEl.href = `/tags/${t}`;
          tagEl.textContent = formatLabel(t);
          if (tagContainer) tagContainer.appendChild(tagClone);
        }
      }

      DOM.resultsContainer.appendChild(article);
    }
  };

  const renderPagination = (total: number, page: number) => {
    DOM.paginationContainer.innerHTML = '';
    if (total <= 1) return;

    const pageTemplate = document.getElementById(
      'search-pagination-template'
    ) as HTMLTemplateElement;
    if (!pageTemplate) return;

    const clone = pageTemplate.content.cloneNode(true) as DocumentFragment;

    const prevBtn = clone.querySelector('#search-prev-btn') as HTMLAnchorElement;
    const prevDisabled = clone.querySelector('#search-prev-disabled') as HTMLSpanElement;
    const nextBtn = clone.querySelector('#search-next-btn') as HTMLAnchorElement;
    const nextDisabled = clone.querySelector('#search-next-disabled') as HTMLSpanElement;
    const pageInfo = clone.querySelector('#search-page-info') as HTMLSpanElement;

    if (pageInfo) {
      pageInfo.textContent = `Page ${page + 1} of ${total}`;
    }

    if (page > 0 && prevBtn) {
      prevBtn.classList.remove('hidden');
      prevBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        currentPage--;
        await renderResults(currentPage);
        renderPagination(total, currentPage);
      });
    } else if (prevDisabled) {
      prevDisabled.classList.remove('hidden');
    }

    if (page < total - 1 && nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        currentPage++;
        await renderResults(currentPage);
        renderPagination(total, currentPage);
      });
    } else if (nextDisabled) {
      nextDisabled.classList.remove('hidden');
    }

    DOM.paginationContainer.appendChild(clone);
  };

  DOM.input.addEventListener('input', (e) => {
    window.clearTimeout(debounceTimer);

    debounceTimer = window.setTimeout(async () => {
      currentQuery = (e.target as HTMLInputElement).value;
      const query = currentQuery;
      const searchId = ++currentSearchId;

      currentPage = 0;
      currentResults = [];

      let search;

      if (query.trim().length === 0) {
        if (DOM.clearBtn) DOM.clearBtn.classList.add('hidden');
        if (DOM.searchIcon) DOM.searchIcon.classList.remove('hidden');
        search = await pagefind.search(null, { sort: { date: 'desc' } });
      } else {
        if (DOM.clearBtn) DOM.clearBtn.classList.remove('hidden');
        if (DOM.searchIcon) DOM.searchIcon.classList.add('hidden');
        search = await pagefind.search(query);
      }

      if (searchId !== currentSearchId) return;

      if (!search || search.results.length === 0) {
        DOM.paginationContainer.innerHTML = '';
        DOM.resultsContainer.innerHTML = '';
        if (query.trim().length === 0) {
          const clone = DOM.emptyTemplate.content.cloneNode(true) as DocumentFragment;
          const msgEl = clone.querySelector('.search-empty-msg')!;
          msgEl.textContent = 'No notes found.';
          DOM.resultsContainer.appendChild(clone);
        } else {
          const h2 = document.createElement('h2');
          h2.className = 'type-h2 text-theme-text';
          h2.textContent = `No results found for "${query}"`;
          DOM.resultsContainer.appendChild(h2);
        }
        return;
      }

      currentResults = search.results;
      totalPages = Math.ceil(currentResults.length / PAGE_CONFIG.notesPerPage);

      await renderResults(0);
      renderPagination(totalPages, 0);
    }, 250);
  });

  if (DOM.clearBtn) {
    DOM.clearBtn.addEventListener('click', () => {
      DOM.input.value = '';
      DOM.input.dispatchEvent(new Event('input'));
      DOM.input.focus();
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');

  if (initialQuery) {
    DOM.input.value = initialQuery;
  }

  DOM.input.dispatchEvent(new Event('input'));
};

initPagefind();
document.addEventListener('astro:after-swap', initPagefind);
