# Project Architecture

## Overview

A mobile-first, ultra-lightweight portfolio and blog website built with Astro.

## Project Structure

```
/
├── ObsidianVault/
├── public/
│   ├── favicon.ico
│   ├── icon.svg
│   ├── apple-touch-icon.png
│   └── manifest.webmanifest
├── src/
│   ├── components/
- `src/components/icons/` (empty — deleted; sanitization logic now lives in `Icon.astro`)
│   │   └── ... (UI components)
│   ├── config/
│   │   └── site.ts
│   ├── layouts/
│   ├── pages/
│   │   ├── search/
│   │   └── [slug].astro
│   ├── tags/
│   │   ├── index.astro
│   │   └── [tag]/
│   │       └── [...page].astro
│   ├── 404.astro
│   ├── scripts/
│   │   └── searchClient.ts
│   └── utils/
│       ├── content.ts
│       └── formatters.ts
├── ARCHITECTURE.md
├── astro.config.mjs
└── package.json
```

**Required Static Assets:** The `public/` directory must contain `favicon.ico`, `icon.svg`, `apple-touch-icon.png`, and `manifest.webmanifest` for modern cross-device favicon support.

## Core Principles

### Design Philosophy & Distraction-Free Reading

This platform is an editorial space, not a SaaS dashboard. The design must emulate a high-end print magazine where content is the primary visual element. If a UI component does not serve the reading experience, remove it.

- **Distraction-Free Constraints:** Articles must be strictly single-column. No sidebars.
- **No Intrusive Elements:** Modal pop-ups, floating share buttons that overlap text, and related-article carousels that break reading flow are strictly forbidden. Related links must be kept exclusively at the absolute bottom of the post.
- **Whitespace as Structure:** White space is a structural element. Give headings room to breathe before body text begins, and pad sections heavily to prevent cramping.

### Mobile-First Policy

All styles must be written mobile-first using CSS media queries. Base styles target mobile devices; progressive enhancement handles larger screens via min-width breakpoints.

### Standard HTML/CSS Only

No JavaScript frameworks or libraries. Pure HTML5 and vanilla CSS (or Tailwind CSS). CSS View Transitions and native CSS animations preferred over JS-based visual effects.

### Tailwind CSS Utility-First Styling

All styling is handled via Tailwind CSS utility classes. Avoid standard `<style>` blocks to maintain a single source of truth for design tokens. This project uses Tailwind v4. All configuration MUST live in `src/styles/global.css`. Do not create a `tailwind.config.mjs` file.

Common layout patterns (e.g., page containers) are centralized as `@utility` classes prefixed with `container-system-` in `global.css`.

### Pure-REM Unit Policy

All sizing and spacing in `@utility` classes MUST use `rem` units exclusively. Pixel values (e.g., `0.5px`) are not permitted. Border widths use `rem` equivalents (e.g., `0.03125rem` for `0.5px`). Container widths use `rem` for character-length optimization (e.g., `48rem` for standard, `45rem` for reading-width).

### Three-Tier Semantic Naming Policy

The codebase enforces a strict three-tier naming convention for colors and fonts to separate functional concerns:

- **System:** Navigation, buttons, borders, and functional UI elements. Font: Inter (`--font-system`).
- **Headline:** Structural page titles, section headers, and display text. Font: Gabarito (`--font-headlines`).
- **Text:** Editorial long-form reading and body copy. Font: Playfair Display (`--font-text`).

All custom `@utility` classes and CSS variables in `global.css` MUST follow this naming structure (e.g., `text-system-caps`, `bg-text-black`, ``). Existing "editorial" prefixed tokens are deprecated and must be replaced on sight.

### Typography Policy

We maintain two strict typographic domains:

1. **Prose Domain:** Raw Markdown content is styled exclusively by the `.prose` class applied via the `<Article>` wrapper.
2. **UI Domain:** All UI components use centralized Tailwind `@utility` classes defined in `global.css` (e.g., `type-h1`, `type-body`). Wrapper components like `<Heading>` and `<Text>` are forbidden to reduce template friction.

### Vertical Rhythm & Spacing Policy

To maintain a cohesive, magazine-like reading experience without creating a brittle codebase, vertical rhythm and layout spacing are strictly systematized:

- **UI Spacing (rhythm-\*):** All UI elements, including typography, have zero intrinsic margins. Vertical and horizontal spacing is strictly managed by parent containers using `rhythm-section`, `rhythm-stack`, and `rhythm-group`.
- **Editorial Spacing (.prose):** Raw markdown content is the ONLY place where native HTML elements (`<p>`, `<ul>`, `<blockquote>`) have intrinsic bottom margins. This is managed globally by the `.prose` class applied via the `<Article />` wrapper.

### Theme & Color Cascade Policy

The system uses a CSS Custom Property cascade via `data-theme` attributes on the `<body>` element to achieve contextual color inversion across four themes:

- **brand-reading** (default): Soft peach background (#ffeee4), dark text
- **brand**: Vibrant brand orange (#f63f0e), white text
- **brand-complimented**: Deep blue (#2b5a7d), white text
- **brand-inverted**: Peach inverted (#ecaa94), dark text

**Component Color Contract:** All UI components MUST use semantic theme tokens (`text-theme-text`, `bg-theme-bg`, `text-theme-muted`, `border-theme-border`) instead of hardcoded color utilities. Components MUST NOT accept `inverted` or `theme` props for visual styling. Color is resolved exclusively through the CSS cascade based on the nearest ancestor's `data-theme` attribute.

**Theme Application:** The `BaseLayout.astro` component sets `data-theme` on `<body>`. Pages pass a `theme` prop (`'brand-reading' | 'brand' | 'brand-complimented' | 'brand-inverted'`) to `BaseLayout` to switch the entire page's color context. Child components automatically inherit the correct colors without prop-drilling.

**Exception for Brand Accents:** Interactive accent colors (e.g., CTA button hover states, brand-specific tag backgrounds) MAY use explicit brand color tokens (`system-brand`, `system-accent-inverted-hover`) when the color is semantically tied to the brand identity rather than the page theme.

### Separation of Concerns (SoC)

Astro components must remain focused strictly on the presentation layer (UI/HTML).

### Complexity & Encapsulation Policy

To maintain a highly legible codebase suitable for AI agent orchestration, complexity must be aggressively hidden behind clean component APIs:

- **Smart Components, Dumb Pages:** Pages (`src/pages/`) are strictly orchestrators. They fetch data via utility functions and pass raw data to components. They MUST NOT format data, calculate state, or contain complex HTML structures.
- **Internal Formatting:** UI components must handle their own internal data formatting. If a component requires a specific data format (like a localized date string or human-readable tag), it must accept the raw data type and format it internally. Parent components must never pre-format data for a child.
- **The "Black Box" Interface:** Complex UI structures must be abstracted behind clean TypeScript `Props` interfaces. If a component requires a vast amount of data to render (e.g., an article card), pass the entire data object (e.g., `post={entry}`) rather than prop-drilling individual properties.
- **Strict 75-Line Threshold:** If the HTML template of _any_ component or page exceeds 75 lines, it is a strict architectural violation. Extract logical blocks into discrete sub-components.
- **Pagefind Indexing Boundaries:** Pagefind MUST NOT index the global `<body>`. All indexable content pages (like `[slug].astro`) MUST wrap their core readable content in a dedicated wrapper element with the `data-pagefind-body` attribute and `class="contents"` to act as a phantom flow anchor. Additionally, all raw SVG/Icon primitives must include `data-pagefind-ignore="all"` on their root `<svg>` tag to prevent SVG path data (e.g., 'aaaaaa') from polluting the search index. Never let UI chrome or icon markup leak into the search corpus.
- **Data Fetching:** All Astro Collection queries, filtering, and sorting must be abstracted into `src/utils/content.ts`. All derivative queries (e.g., fetching by tag, related posts) MUST cascade from `getSortedNotes()` to ensure chronological consistency across the application. Never bypass the sorting layer.
- **Global Data:** Hardcoding global data (names, emails, SEO titles, external service URLs) in UI components is forbidden. Use `site.config.json` as the single source of truth. External third-party service URLs (e.g., Koalendar booking) must be managed in `site.config.json` to ensure consistency across the orchestrator components.
- **Heavy Client Logic:** Complex client-side JavaScript (e.g., search indexing, API calls) must be isolated in `src/scripts/` and imported into the `.astro` file. Trivial UI interactions (e.g., mobile menu toggles) may remain in scoped `<script>` tags within the component.
- **Client-Side Rendering:** Never use HTML string literals inside `src/scripts/`. Always use hidden HTML `<template>` tags in the `.astro` file and clone them via DOM manipulation in the script.
- **Page Componentization:** Page files (e.g., `index.astro`, `search.astro`) must act strictly as orchestrators. If an Astro component's HTML template exceeds 75 lines, extract logical sections into sub-components. Massive blocks of HTML should not live directly in the page file. Extract major structural blocks into dedicated UI components (e.g., `<HeroSection>`, `<SearchInterface>`) to maintain readability and DRY principles. The `404.astro` page is explicitly mapped for GitHub Pages static error routing — Astro automatically outputs this as `404.html` at build time, which GitHub Pages serves for missing routes.
- **Component Taxonomy:** Enforce Atomic Design principles:
  - **Primitives:** Base-level UI elements (Buttons, Typography, Tags). These are stateless, reusable, and focused on single responsibilities.
  - **Blocks:** Composite components that combine Primitives (Hero, Cards, Headers, PageTitle, ArticleMeta). These orchestrate layout and composition.
  - **Layouts:** Page-level scaffolding (BaseLayout). Must not contain monolithic HTML `<head>` blocks; extract SEO meta tags into dedicated `SeoHead` component.
- **Layout Orchestration:** All layout scaffolding (Header, Footer) is centrally orchestrated in `BaseLayout.astro`. Pages must NOT import or render Header/Footer directly; instead, they pass `currentPath` and `flushFooter` props to `BaseLayout`.
- **Article Content:** All markdown content rendered via Astro Content Collections MUST be wrapped in the `<Article />` component. This component enforces the `font-text` family and `prose` constraints. Never render raw markdown content without this wrapper.
- **Paginated Routes:** The Tags hub uses a dynamic paginated route at `src/pages/tags/[tag]/[...page].astro`. All pagination configuration (page size) is centralized in `PAGE_CONFIG` within `src/config/ui.ts`.
- **Server-Side UI Logic:** Whenever possible, calculate UI states (like dynamic breadcrumb paths or navigation active states) at build-time within the Astro frontmatter (`---`). Do not rely on client-side JavaScript for logic that can be statically generated.
- **Styles:** Handled entirely via Tailwind CSS utility classes. `<style>` tags are forbidden unless absolutely required for dynamic logic that Tailwind cannot handle. Global layout patterns MUST be defined as `@utility` classes in `src/styles/global.css`. Local component variants MUST use a static `variants` mapping object (e.g., `const variants = { standard: '...', hero: '...' }`) to ensure the Tailwind scanner detects all class references.
- **AST Markdown Pipeline:** Standard markdown parsing is intercepted in astro.config.mjs. Obsidian [[Wikilinks]] are parsed by remark-wiki-link and dynamically routed to the /search/ subpath. External links automatically receive target="_blank" via rehype-external-links.

### JSDoc Documentation

Every component, function, and interface must include JSDoc-style comments detailing:

- Purpose of the element/function
- Props interface definition
- Reasoning for future AI agents

### Iconography Policy

To avoid dependency bloat and maintain the zero-JS-framework rule, third-party icon libraries are forbidden. All icons must be pure `.svg` files placed in `src/assets/icons/`. To render an icon, use the dynamic `<Icon name="filename" />` component (e.g., `<Icon name="github" />`). This component uses Vite's `import.meta.glob` to fetch the raw SVG, sanitizes it internally (stripping hardcoded sizing/colors and injecting `currentColor`), and renders it directly.

### Media Performance Policy

To maintain high Lighthouse scores and instant load times, all media assets must adhere to strict performance budgets:

- **Images:**
  - Must be served in next-gen formats (WebP or AVIF).
  - Must be processed through Astro's native `<Image />` component whenever possible to handle automatic optimization and responsive resizing.
  - Maximum file size: 500KB for full-screen hero images.
- **Background Videos:**
  - Must be self-hosted MP4 files (H.264 encoded) placed in the `public/` directory.
  - Third-party embeds (e.g., YouTube, Vimeo) are **strictly forbidden** due to their heavy JavaScript payloads and UI overlays.
  - **Exception:** YouTube videos are permitted ONLY if implemented via the Facade pattern (e.g., `lite-youtube-embed`) to prevent upfront JavaScript payloads. Raw iframes are intercepted and rewritten at build-time.
  - Must utilize native HTML5 attributes: `<video autoplay loop muted playsinline>`.
  - Must have the audio track physically stripped from the file.
  - Maximum file size: 5MB (Target: 2MB). Recommended resolution: 1080p or 720p at 24/30fps.

## Visual Effects Policy

This site is motion-free. CSS transitions, animations, and smooth scrolling are strictly forbidden to maintain a high-end, static editorial aesthetic. Interactivity must be instantaneous.

## Tooling & Package Management

### Node Package Manager (NPM)

- **Dependency Management:** NPM is the strict standard for this project. Do not use Yarn, pnpm, or Bun to ensure environmental consistency.
- **Commands:**
  - `npm run dev`: Starts the local Astro development server.
  - `npm run build`: Compiles the static site into the `dist/` directory.
  - `npm run preview`: Serves the compiled `dist/` directory locally for production testing.

### Dependency Rules for AI Agents

- Any new dependencies must be strictly justified under the "Core Principles" (No JS frameworks unless absolutely necessary).
- Documentation (JSDoc/Markdown) must be updated immediately when adding new scripts or dependencies.

### Guardrails & Quality Assurance

- **AI Enforcement:** A `.cursorrules` file is present in the root. AI agents are strictly bound by these rules to prevent framework hallucination and enforce Tailwind CSS styling.
- **Formatting:** Prettier is configured. Run `npm run format` to standardize code style.
- **Type Checking:** Astro's built-in `astro check` is used to validate component props and TypeScript types. Run `npm run check`.
- **Strict Linting (ESLint & Stylelint):** - **JSDoc Enforcement:** ESLint strictly requires JSDoc `@file` and `@description` tags on all Astro components.
  - **Mobile-First Enforcement:** Stylelint will throw a fatal error if `@media (max-width: ...)` is used, enforcing mobile-first design.
  - Run `npm run lint` to execute these checks. Run `npm run validate` to run all checks and formatting before committing.

### Plugin & Integration Policy

We encourage the use of battle-hardened, official plugins for Astro and Tailwind CSS to solve standard problems (e.g., SEO, sitemaps, typography formatting).

- **Allowed:** Build-time integrations and plugins that output static HTML/CSS or have a near-zero client-side JavaScript footprint.
- **Forbidden:** Heavy client-side UI component libraries that require runtime JavaScript (e.g., Radix, Headless UI, Alpine.js) for simple interactive elements like burger menus or accordions. Use vanilla JS scoped via Astro `<script>` tags instead.
