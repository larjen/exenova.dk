/**
 * @file content.config.ts
 * @description Astro Content Collections configuration for notes.
 * Loader configuration (SITE_CONFIG.includeNotes) controls whether Obsidian files
 * are included during the build. This separation ensures routing config changes
 * don't require modifications to content schema definitions.
 */
import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { SITE_CONFIG } from './config/site.ts';

const notesCollection = defineCollection({
  loader: glob({
    pattern: SITE_CONFIG.includeNotes ? '**/[^_]*.md' : '**/__DISABLED_DO_NOT_MATCH__.md',
    base: SITE_CONFIG.vaultPath,
  }),
  /**
   * @description Zod schema for notes collection.
   * Conditionally loads markdown files based on SITE_CONFIG.includeNotes.
   * Uses z.coerce.string() for date field to handle YAML parser converting unquoted
   * dates to Date objects.
   */
  schema: z.object({
    title: z.string(),
    date: z.coerce.string(),
    description: z.string(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  }),
});

export const collections = {
  notes: notesCollection,
};
