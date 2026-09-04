import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import AutoImport from 'astro-auto-import';

export default defineConfig({
  // Your GitHub Pages URL
  site: 'https://docs.timothyjohnsonwrites.com',

  integrations: [
    AutoImport({
      imports: [
        {
          '@astrojs/starlight/components': [
            'Aside',
            'Steps',
            'Tabs',
            'TabItem',
            'Card',
            'CardGrid',
            'FileTree',
            'Badge',
            'Icon',
            'LinkCard',
          ],
        },
      ],
    }),
    starlight({
      title: 'Knowledge Base',
      favicon: '/tjw_logo.png',
      head: [
        // 1. Load the Google Analytics script
        {
          tag: 'script',
          attrs: {
            src: 'https://www.googletagmanager.com/gtag/js?id=G-6JPFC14SP9',
            async: true,
          },
        },
        // 2. Initialize the tracker
        {
          tag: 'script',
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6JPFC14SP9');
          `,
        },
      ],
      logo: {
        src: './src/assets/tjw_logo.png',
      },
      // UPDATED: Social links must now be an array of objects
      social: [
        { 
          icon: 'github', 
          label: 'GitHub', 
          href: 'https://github.com/write-tim/sveltia-docs-test' 
        },
        { 
          icon: 'linkedin', 
          label: 'LinkedIn', 
          href: 'https://www.linkedin.com/in/timothy-michael-johnson/' 
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/write-tim/sveltia-docs-test/edit/main/',
      },
      credits: true,
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Back to Portfolio',
          link: 'https://timothyjohnsonwrites.com',
        },
        {
          label: '1. Architecture & Philosophy',
          items: [
            { label: 'The Docs-as-Code Manifesto', slug: 'guides/docs-as-code' },
            { label: 'Tech Stack Overview', slug: 'guides/tech-stack' },
            { label: 'System Flow (Local to CDN)', slug: 'guides/system-flow' },
          ],
        },
        {
          label: '2. Component Library (Behind the Curtain)',
          items: [
            { autogenerate: { directory: 'components' } }
          ],
        },
        {
          label: '3. Sveltia CMS Manual',
          items: [
            { autogenerate: { directory: 'cms' } }
          ],
        },
        {
          label: '4. Automation & Quality Gates',
          items: [
            { label: 'Frontmatter Schemas with Zod', slug: 'guides/zod-schemas' },
            { label: 'Quality Pipelines (CI/CD)', slug: 'guides/ci-cd-pipelines' },
          ],
        },
      ],
    }),
  ],
});