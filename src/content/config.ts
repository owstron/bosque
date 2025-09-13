import { defineCollection, z } from 'astro:content';

const specialsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dateRange: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
  }),
});

export const collections = {
  'specials': specialsCollection,
};