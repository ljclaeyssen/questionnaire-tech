import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Questionnaire Tech Angular',
  tagline: 'Questions d\'entretien technique Angular - Junior, Confirmé, Senior',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://ljclaeyssen.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/questionnaire-tech/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'ljclaeyssen', // Usually your GitHub org/user name.
  projectName: 'questionnaire-tech', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: 'questions',
          sidebarPath: './sidebars.ts',
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/ljclaeyssen/questionnaire-tech/tree/master/',
        },
        blog: false, // Désactivé car on se concentre sur la documentation
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'code-review',
        path: 'code-review',
        routeBasePath: 'code-review',
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/ljclaeyssen/questionnaire-tech/tree/master/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'cas-pratiques',
        path: 'cas-pratiques',
        routeBasePath: 'cas-pratiques',
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/ljclaeyssen/questionnaire-tech/tree/master/',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Questionnaire Tech Angular',
      logo: {
        alt: 'Angular Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Questions',
        },
        {
          to: '/code-review/intro',
          label: 'Code Review',
          position: 'left',
        },
        {
          to: '/cas-pratiques/intro',
          label: 'Cas Pratiques',
          position: 'left',
        },
        {
          href: 'https://github.com/ljclaeyssen/questionnaire-tech',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Questions',
          items: [
            {
              label: 'Junior',
              to: '/questions/category/junior',
            },
            {
              label: 'Confirmé',
              to: '/questions/category/confirmé',
            },
            {
              label: 'Senior',
              to: '/questions/category/senior',
            },
          ],
        },
        {
          title: 'Pratique',
          items: [
            {
              label: 'Code Review',
              to: '/code-review/intro',
            },
            {
              label: 'Cas Pratiques',
              to: '/cas-pratiques/intro',
            },
          ],
        },
        {
          title: 'Ressources',
          items: [
            {
              label: 'Documentation Angular',
              href: 'https://angular.dev',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/angular',
            },
          ],
        },
        {
          title: 'Plus',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ljclaeyssen/questionnaire-tech',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Questionnaire Tech Angular. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['typescript', 'bash', 'json', 'scss'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
