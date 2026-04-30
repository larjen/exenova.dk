/**
 * @file rehype-youtube.ts
 * @description Rehype plugin to transform YouTube iframes into lite-youtube-embed elements for performance.
 * This enables the Facade pattern to prevent upfront JavaScript payloads from YouTube embeds.
 */
import { visit } from 'unist-util-visit';

/**
 * @description Rehype plugin to transform YouTube iframes into lite-youtube-embed elements.
 * @returns {Function} Unified transformer factory.
 */
export default function rehypeYoutube() {
  return (tree: any) => {
    visit(tree, (node: any) => {
      // Handle raw HTML nodes containing iframes (from Markdown direct embeds)
      if (node.type === 'raw' && node.value?.includes('iframe')) {
        const match = node.value.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
        if (match) {
          const videoId = match[1].split('?')[0];
          node.type = 'element';
          node.tagName = 'lite-youtube';
          node.properties = { videoid: videoId, params: 'rel=0' };
          node.children = [];
          delete node.value;
        }
        return;
      }

      // Handle parsed iframe elements
      if (node.type === 'element' && node.tagName === 'iframe') {
        const src = node.properties?.src || '';

        if (src.includes('youtube.com') || src.includes('youtu.be')) {
          let videoId = '';
          try {
            const urlObj = new URL(src.startsWith('http') ? src : `https:${src}`);
            if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
              videoId = urlObj.pathname.split('/').filter(Boolean)[0]?.split('?')[0] || '';
            }
          } catch {
            // Ignore URL parse errors
          }

          if (videoId) {
            node.tagName = 'lite-youtube';
            node.properties = { videoid: videoId, params: 'rel=0' };
            node.children = [];
          }
        }
      }
    });
  };
}
