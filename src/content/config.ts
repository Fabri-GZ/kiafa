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
    // Slugs of OTHER entries in this same collection, e.g. "destapaciones-mataderos".
    // Unresolvable slugs are dropped at build with a console.warn (see [slug].astro).
    // An empty array is legal and renders nothing: [slug].astro guards on length.
    nearbyBarrios: z.array(z.string().min(1)).optional(),
    // Optional last-real-change date ("YYYY-MM-DD"), used by sitemap.xml.ts
    // to emit <lastmod>. Omitted entirely when this field is absent — never
    // falls back to the build date. Bump only on a real content change.
    updatedAt: z.string().date().optional(),
  }),
});

export const collections = {
  services,
  locations,
};