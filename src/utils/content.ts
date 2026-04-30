/**
 * @file content.ts
 * @description Utility functions for accessing and filtering notes.
 * Provides a centralized API for content operations to enforce DRY and SoC.
 */

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

/**
 * @description Fetches all non-draft entries from the 'notes' collection.
 * Use this function when you need to filter or process notes without sorting.
 * @returns {Promise<CollectionEntry<'notes'>[]>} Array of published note entries.
 */
export async function getPublishedNotes(): Promise<CollectionEntry<'notes'>[]> {
  return getCollection('notes', ({ data }) => {
    return data.draft !== true;
  });
}

/**
 * @description Fetches all published notes and sorts them by date in descending order.
 * Use this for listing pages that require chronologically ordered content.
 * @returns {Promise<CollectionEntry<'notes'>[]>} Array of sorted note entries, newest first.
 */
async function getSortedNotes(): Promise<CollectionEntry<'notes'>[]> {
  const published = await getPublishedNotes();
  return published.sort((a, b) => {
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });
}

/**
 * @description Fetches all published (non-draft) notes related to the given entry,
 * sorted by date in descending order. Use this for displaying related content
 * on individual note pages.
 * @param {CollectionEntry<'notes'>} entry - The note entry to get related notes for.
 * @returns {Promise<CollectionEntry<'notes'>[]>} Array of sorted related note entries, newest first.
 */
export async function getRelatedNotes(
  entry: CollectionEntry<'notes'>
): Promise<CollectionEntry<'notes'>[]> {
  const sortedNotes = await getSortedNotes();
  return sortedNotes.filter((t) => entry.data.related.includes(t.id));
}

/**
 * @description Fetches all unique tags from published notes, sorted alphabetically.
 * Use this to generate tag clouds or static paths for tag routes.
 * @returns {Promise<string[]>} Array of unique tag strings.
 */
export async function getUniqueTags(): Promise<string[]> {
  const published = await getPublishedNotes();
  const tags = published.flatMap((note) => note.data.tags || []);
  return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
}

/**
 * @description Fetches all published notes that contain the specified tag,
 * sorted by date in descending order. Use this for tag-based filtering in
 * dynamic routes.
 * @param {string} tag - The tag to filter notes by.
 * @returns {Promise<CollectionEntry<'notes'>[]>} Array of sorted note entries containing the tag, newest first.
 */
export async function getNotesByTag(tag: string): Promise<CollectionEntry<'notes'>[]> {
  const sortedNotes = await getSortedNotes();
  return sortedNotes.filter((note) => note.data.tags?.includes(tag));
}
