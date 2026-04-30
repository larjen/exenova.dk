// @ts-check
import { defineConfig } from 'astro/config';
import { execSync } from 'node:child_process';
import { rmSync, writeFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import rehypeFigure from 'rehype-figure';
import rehypeYoutube from './src/utils/rehype-youtube';
import { wikiLinkPlugin } from 'remark-wiki-link';
import rehypeExternalLinks from 'rehype-external-links';
import GithubSlugger from 'github-slugger';
import sitemap from '@astrojs/sitemap';
import { SITE_CONFIG } from './src/config/site.ts';

export default defineConfig({
  site: SITE_CONFIG.siteUrl,
  integrations: [
    ...(SITE_CONFIG.useSiteMap
      ? [
          sitemap({
            filter: (page) => {
              if (!SITE_CONFIG.includeNotes) {
                const path = new URL(page).pathname;
                return !path.startsWith('/search') && !path.startsWith('/tags');
              }
              return true;
            },
          }),
        ]
      : []),
    {
      name: 'pagefind-index',
      hooks: {
        'astro:build:done': ({ dir }) => {
          console.log('Generating CNAME file...');
          writeFileSync(new URL('CNAME', dir), SITE_CONFIG.baseUrl);

          console.log('Generating .nojekyll to bypass GitHub Pages processing...');
          writeFileSync(new URL('.nojekyll', dir), '');

          if (SITE_CONFIG.includeNotes) {
            console.log('Building Pagefind index...');
            execSync('npx pagefind --site dist', { stdio: 'inherit' });
          } else {
            console.log('Notes disabled: Skipping Pagefind and cleaning up search/tags routes...');
            // Safely remove both file and directory formats depending on Astro's build format
            rmSync(new URL('search', dir), { recursive: true, force: true });
            rmSync(new URL('search.html', dir), { force: true });
            rmSync(new URL('tags', dir), { recursive: true, force: true });
            rmSync(new URL('tags.html', dir), { force: true });
          }
        },
      },
    },
  ],
  markdown: {
    remarkPlugins: [
      [wikiLinkPlugin, {
        aliasDivider: '|',
        pageResolver: (name) => {
          const slugger = new GithubSlugger();
          return [slugger.slug(name)];
        },
        hrefTemplate: (permalink) => `/search/${permalink}`
      }]
    ],
    rehypePlugins: [
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer']
      }],
      rehypeYoutube,
      rehypeFigure,
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
