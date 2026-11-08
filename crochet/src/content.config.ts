import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['home', 'wear']),
    number: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    featured: z.boolean().default(false),
    details: z.array(z.string()),
  }),
});

export const collections = { products };
