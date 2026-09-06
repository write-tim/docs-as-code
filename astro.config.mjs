import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import AutoImport from 'astro-auto-import';
import mermaid from 'astro-mermaid';

function generateArticlesManifest() {
  const docsDir = path.resolve('./src/content/docs');
  const targetFile = path.resolve('./public/admin/articles.json');
  if (!fs.existsSync(docsDir)) return;

  function getFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(fullPath));
      } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const files = getFiles(docsDir);
  const catMap = {
    philosophy: '1. Architecture & Philosophy',
    cms: '2. Sveltia CMS Manual',
    automation: '3. Automation & Quality Gates',
    components: '4. Component Library',
    guides: '5. Style Guide & Standards',
  };

  const articles = files.map((file) => {
    const content = fs.readFileSync(file, 'utf8');
    const rel = path.relative(docsDir, file);
    const titleMatch = content.match(/^title:\s*["'`]?(.*?)["'`]?$/m);
    const descMatch = content.match(/^description:\s*["'`]?(.*?)["'`]?$/m);
    const title = titleMatch ? titleMatch[1].trim() : path.basename(file, path.extname(file));
    const desc = descMatch ? descMatch[1].trim() : '';

    let route = '/' + rel.replace(/\\/g, '/').replace(/(index)?\.(mdx|md)$/, '');
    if (!route.endsWith('/') && route !== '/') route += '/';
    if (route === '//') route = '/';

    const parts = rel.split(path.sep);
    let category = 'General';
    if (parts.length > 1) {
      const catKey = parts[0];
      category = catMap[catKey] || catKey.charAt(0).toUpperCase() + catKey.slice(1);
    } else if (rel === 'index.mdx' || rel === 'index.md') {
      category = 'Home';
    }

    return { title, route, desc, category, file: rel };
  });

  articles.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title.localeCompare(b.title);
  });

  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, JSON.stringify(articles, null, 2), 'utf8');
}

const articleManifestIntegration = () => ({
  name: 'article-manifest-generator',
  hooks: {
    'astro:config:setup': () => {
      generateArticlesManifest();
    },
    'astro:server:setup': () => {
      generateArticlesManifest();
    },
    'astro:build:start': () => {
      generateArticlesManifest();
    },
  },
});

export default defineConfig({
  // Your GitHub Pages URL
  site: 'https://docs.timothyjohnsonwrites.com',

  integrations: [
    articleManifestIntegration(),
    mermaid({ 
      autoTheme: true
    }),
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
      title: 'Docs-as-Code Blueprint',
      favicon: '/tjw_logo.png',
      defaultLocale: 'root',
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
          href: 'https://github.com/write-tim' 
        },
        { 
          icon: 'linkedin', 
          label: 'LinkedIn', 
          href: 'https://www.linkedin.com/in/timothy-michael-johnson/' 
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/write-tim/docs-as-code/edit/main/',
      },
      credits: true,
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: '1. Architecture & Philosophy',
          items: [
            { autogenerate: { directory: 'philosophy' } }
          ],
        },
        {
          label: '2. Sveltia CMS Manual',
          items: [
            { autogenerate: { directory: 'cms' } }
          ],
        },
        {
          label: '3. Automation & Quality Gates',
          items: [
            { autogenerate: { directory: 'automation' } }
          ],
        },
        {
          label: '4. Component Library',
          items: [
            { autogenerate: { directory: 'components' } }
          ],
        },
        {
          label: '5. Style Guide & Standards',
          items: [
            { autogenerate: { directory: 'guides' } }
          ],
        },
      ],
    }),
  ],
});