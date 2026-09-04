import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        // Add any custom metadata fields you defined in Sveltia config.yml
        category: z.string().optional(),
        lastUpdatedBy: z.string().optional(),
      }),
    }),
  }),
};