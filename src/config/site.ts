/**
 * @file site.ts
 * @description Global site configuration containing author info, contact details, and SEO defaults.
 * Centralizes hardcoded values by reading directly from the site.config.json file
 * to enforce a single source of truth across the codebase.
 */
import config from '../../site.config.json';

export const SITE_CONFIG = {
  authorName: config.authorName,
  email: config.email,
  githubUrl: config.githubUrl,
  linkedinUrl: config.linkedinUrl,
  baseUrl: config.baseUrl,
  siteUrl: `https://${config.baseUrl}`,
  defaultTitle: config.defaultTitle,
  defaultDescription: config.defaultDescription,
  hideNavigation: !config.showMenubar,
  useSiteMap: config.createSitemap,
  includeNotes: config.includeNotes !== false,
  vaultPath: config.vaultPath,
} as const;
