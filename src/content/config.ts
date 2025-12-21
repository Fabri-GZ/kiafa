import { defineCollection, z } from "astro:content";

const services = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    seoTitle: z.string(),
    seoDescription: z.string(),
    icon: z.enum([
      'house',
      'cloud-rain',
      'toilet',
      'utensils',
      'tv-minimal-play',
      'building-2'
    ]),
  }),
});
export const collections = { services };