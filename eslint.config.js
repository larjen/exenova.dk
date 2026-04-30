import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsdoc from 'eslint-plugin-jsdoc';
import tsParser from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: eslintPluginAstro.parser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
      globals: {
        ImageMetadata: 'readonly',
      },
    },
    rules: {
      'jsdoc/require-file-overview': [
        'error',
        {
          tags: {
            file: { initialCommentsOnly: true, mustExist: true },
            description: { mustExist: true },
          },
        },
      ],
      'jsdoc/check-tag-names': ['error', { definedTags: ['slot'] }],
      'jsdoc/reject-any-type': 'off',
      'jsdoc/reject-function-type': 'off',
      'astro/no-set-html-directive': 'warn',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/(?<![a-z-])(mt|mb|my)-[0-9]+/]',
          message:
            'ARCHITECTURE VIOLATION: Ad-hoc margin (mt-*, mb-*, my-*) is forbidden. Use rhythm-section, rhythm-stack, or rhythm-group for structural spacing. Prose spacing is handled by global.css.',
        },
        {
          selector: 'TemplateElement[value.raw=/(?<![a-z-])(mt|mb|my)-[0-9]+/]',
          message:
            'ARCHITECTURE VIOLATION: Ad-hoc margin (mt-*, mb-*, my-*) is forbidden. Use rhythm-section, rhythm-stack, or rhythm-group for structural spacing. Prose spacing is handled by global.css.',
        },
        {
          selector:
            'Literal[value=/(?<![a-z-])(text-(xs|sm|base|lg|[2-9]xl)|font-(headlines|text|system|light|normal|medium|bold|heavy)|leading-(tight|snug|normal|relaxed|loose)|tracking-(tighter|tight|normal|wide|wider|widest|\\[.*?\\]))(?![a-z-])/]',
          message:
            'ARCHITECTURE VIOLATION: Primitive typography classes (font-*, text-size, leading-*, tracking-*) are strictly forbidden in templates. You MUST use the semantic `type-*` utilities (e.g., type-h1, type-body) defined in global.css.',
        },
        {
          selector:
            'TemplateElement[value.raw=/(?<![a-z-])(text-(xs|sm|base|lg|[2-9]xl)|font-(headlines|text|system|light|normal|medium|bold|heavy)|leading-(tight|snug|normal|relaxed|loose)|tracking-(tighter|tight|normal|wide|wider|widest|\\[.*?\\]))(?![a-z-])/]',
          message:
            'ARCHITECTURE VIOLATION: Primitive typography classes (font-*, text-size, leading-*, tracking-*) are strictly forbidden in templates. You MUST use the semantic `type-*` utilities (e.g., type-h1, type-body) defined in global.css.',
        },
        {
          selector:
            'JSXOpeningElement[name.type="JSXIdentifier"][name.name=/^[A-Z]/]:not([name.name=/^(Icon|BaseIcon|Button|Kicker|Article|LogoLink|SocialLink|Image)$/]) > JSXAttribute[name.name="class"]',
          message:
            'ARCHITECTURE VIOLATION: Leaky Abstraction. Complex components MUST act as a Black Box and cannot accept arbitrary `class` props. Use strictly typed props (e.g., `variant="compact"`) to alter internal state, and wrap the component in a layout div if you need to control its external position.',
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: tsParser,
      globals: {
        document: 'readonly',
        HTMLElement: 'readonly',
        HTMLTemplateElement: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLAnchorElement: 'readonly',
        HTMLSpanElement: 'readonly',
        HTMLUListElement: 'readonly',
        DocumentFragment: 'readonly',
        Event: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        console: 'readonly',
        process: 'readonly',
        window: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        Response: 'readonly',
      },
    },
    rules: {
      'jsdoc/require-jsdoc': 'error',
      'jsdoc/require-description': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'jsdoc/reject-any-type': 'off',
      'jsdoc/reject-function-type': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/(?<![a-z-])(mt|mb|my)-[0-9]+/]',
          message:
            'ARCHITECTURE VIOLATION: Margin classes are strictly forbidden in configuration files and design tokens (like ui.ts). Spacing is exclusively the responsibility of layout containers.',
        },
      ],
    },
  },
  {
    files: ['**/StyleGuideViewer.astro', '**/StyleGuideSection.astro'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    ignores: ['dist/*', '.astro/*', 'public/pagefind/*'],
  },
];
