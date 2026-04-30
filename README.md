# Exenova.dk - Obsidian based static site generator powered by Astro

[![Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Zero JS](https://img.shields.io/badge/Zero_JS_Frameworks-Strict-red?style=flat-square)](#core-principles)

A mobile-first, ultra-lightweight Obsidian powered static site generator built with Astro.

This repository powers **exenova.dk**. It is prioritizing content and reading experience above all else. To achieve blazing-fast performance and a highly maintainable codebase (optimized for AI agent orchestration), it strictly enforces a zero-JS-framework policy and relies purely on HTML5, Astro components, and Tailwind CSS v4.

## Key Features

- **Obsidian Integration:** Content is authored and managed natively via Obsidian. The repository acts as a publishing layer for a flat, local markdown vault.
- **Zero-JS Frameworks:** No React, Vue, Svelte, or Alpine.js. Interactive elements are handled via native HTML/CSS or scoped vanilla JavaScript.
- **Mobile-First CSS:** Strict mobile-first architecture. Progressive enhancement handles larger screens via `min-width` media queries.
- **Tailwind CSS v4:** Pure utility-first styling. All design tokens and container utilities are centralized in `src/styles/global.css`.
- **Headless Search:** Client-side, lightning-fast static search indexing powered by Pagefind.
- **Aggressive Media Optimization:** Native Astro `<Image />` handling and Facade-pattern YouTube embeds (`lite-youtube-embed`) to prevent upfront JS payloads.
- **Sitemap:** Automatically generated and pushed on deployment.
- **Agentic Guardrails:** Strict `.cursorrules`, ESLint, and Stylelint configurations designed to keep AI coding agents strictly aligned with the architecture.

## Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher.
- **NPM**: This project strictly uses `npm` for package management to ensure environmental consistency. (Do not use Yarn, pnpm, or Bun).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/larjen/exenova.dk.git
   cd exenova.dk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

The platform is designed to be easily configurable without digging into the Astro components. All global configuration lives in the `"config"` object inside `package.json`.

This single source of truth controls site metadata, application toggles, deployment targets, and the location of your markdown content.

### Setting up the Obsidian Vault

By default, the platform looks for markdown notes in the local `./ObsidianVault` directory. If you want to keep your repository clean and point the compiler directly to an external, private Obsidian vault on your computer:

1. Open `package.json`.
2. Locate `"vaultPath"` in the `"config"` object.
3. Update the value to the relative or absolute path of your actual Obsidian vault (e.g., `"../MyPrivateVault"`).

Astro will dynamically read and compile notes directly from your external vault. Make sure your notes follow the frontmatter rules in [_New-Note.md](./ObsidianVault/_New-Note.md).

### Split-Repository Deployment (Private Source ➔ Public Hosting)

This platform uses a secure deployment architecture. You can keep your Astro source code, configuration, and raw Obsidian notes in a **private** repository, while publishing only the compiled, static HTML/CSS to a **public** GitHub repository for hosting.

To configure this:

1. Open `package.json`.
2. In the `"config"` object, update `"deployRepo"` to the `.git` URL of your public hosting repository (e.g., `"https://example.com/example-repo.git"`).
3. In GitHub settings enable GitHub Pages, and choose deploy from a branch. 
4. Update `"deployBranch"` to the target branch (usually `"main"` or `"master"`).

When you are ready to publish, run:

```bash
npm run deploy
```

This script will compile the site, copy necessary static assets (like `.nojekyll` and `CNAME`), and automatically force-push the raw `dist/` output to your public repository without exposing your source code.

## Development

Inside the project directory, use the following commands to spin up the environment or build for production:

| Command            | Description                                                                                                               |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`      | Starts the local Astro development server.                                                                                |
| `npm run build`    | Compiles the static site into `dist/` AND builds the Pagefind search index.                                               |
| `npm run preview`  | Serves the compiled `dist/` directory locally to test the production build.                                               |
| `npm run format`   | Standardizes code style across the project using Prettier.                                                                |
| `npm run lint`     | Executes ESLint and Stylelint to enforce architectural guardrails.                                                        |
| `npm run validate` | Runs Astro type checks, linting, and formatting in one go. Run this before committing.                                    |
| `npm run deploy`   | Compiles the static site and automatically force-pushes the raw HTML/CSS output directly to the remote GitHub repository. |

## Architecture & Contribution

This project is governed by aggressive architectural constraints to maintain a clean, predictable, and highly performant codebase.

Before making changes or orchestrating AI agents to write code, please review the core directives:

- [**Architecture Policy (`ARCHITECTURE.md`)**](./ARCHITECTURE.md) - Rules on SoC, pure-REM units, component taxonomy, and data fetching.
- [**Content Guidelines (`CONTENT_GUIDELINES.md`)**](./CONTENT_GUIDELINES.md) - Directives for authoring, structuring, and tagging markdown notes within Obsidian.

> **Note for AI Agents:** Agents must strictly adhere to the `.cursorrules` and ARCHITECTURE.md files located in the root directory.

## Contact & Inquiries

Crafted by AI agents, orchestrated by Lars Jensen in 2026.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/larsjensendenmark/)
