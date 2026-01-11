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
const locations = defineCollection({
  schema: z.object({
    title: z.string(),                 
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoKeywords: z.string().optional(),
    span: z.string(),
    h1: z.string(),
    intro: z.string(),
    zoneDescription: z.string(),                
  }),
});

export const collections = {
  services,
  locations,
};