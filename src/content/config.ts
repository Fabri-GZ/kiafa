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
// Paragraphs of plain prose framing a structured body section. Plain text
// only: these are not rendered as markdown. A paragraph carrying inline
// emphasis stays in the markdown body instead.
const proseBlock = z.array(z.string().min(1)).min(1);

const termItem = z.object({
  term: z.string().min(1),
  description: z.string().min(1),
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

    // Structured halves of a barrio body, rendered by the Body*.astro
    // components (src/components/BodyServices.astro, BodyMethod.astro,
    // BodyPrevention.astro, BodyFaq.astro). Order on the page and in the
    // navbar dropdown is fixed by BODY_SECTIONS in src/lib/bodySections.ts,
    // not by key order here. All optional: a location with none of them
    // renders exactly as before this field set was added.
    // `items` is no longer sourced from content: the "qué destapamos" list
    // is identical on every barrio page (#1002 decision 2), so
    // BodyServices.astro reads it from SHARED_SERVICE_ITEMS in
    // src/lib/bodySections.ts instead. Kept optional here, not removed,
    // so an old frontmatter copy left on disk parses harmlessly (zod
    // strips unknown/unused keys) rather than failing the build.
    bodyServices: z.object({
      heading: z.string().min(1),
      lead: proseBlock.optional(),
      items: z.array(z.string().min(1)).min(1).optional(),
      note: proseBlock.optional(),
    }).optional(),

    // .max(2) because BodyMethod.astro maps its two items onto a fixed
    // two-icon array (Route, Cone); a third item would have no icon. The
    // cap makes that a parse error at build instead of an undefined icon
    // at render.
    bodyMethod: z.object({
      heading: z.string().min(1),
      lead: proseBlock.optional(),
      items: z.array(termItem).min(1).max(2),
      note: proseBlock.optional(),
    }).optional(),

    bodyPrevention: z.object({
      heading: z.string().min(1),
      lead: proseBlock.optional(),
      items: z.array(termItem).min(1),
      note: proseBlock.optional(),
    }).optional(),

    bodyFaq: z.object({
      heading: z.string().min(1),
      lead: proseBlock.optional(),
      items: z.array(z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      })).min(1),
      note: proseBlock.optional(),
    }).optional(),

    // Three new sections added by the #999 visual redesign, rendered by
    // BodyCauses.astro, BodyBrokenPipe.astro and BodyQuote.astro
    // respectively (slices 9, 10, 12). Additive and optional, same pattern
    // as the four fields above: a location with none of them renders
    // exactly as before this field set was added.

    // Exactly 3 cards per #999 ("Por qué se tapan"), one per construction
    // type. `dataIcon`/`dataText` are the secondary data line below the
    // border-top divider (e.g. "raíces por el arbolado").
    bodyCauses: z.object({
      heading: z.string().min(1),
      lead: proseBlock.optional(),
      items: z.array(z.object({
        icon: z.string().min(1),
        eyebrow: z.string().min(1),
        title: z.string().min(1),
        cause: z.string().min(1),
        dataIcon: z.string().min(1),
        dataText: z.string().min(1),
      })).length(3),
      note: proseBlock.optional(),
    }).optional(),

    // "Cuando la cañería está rota". Exactly 2 paragraphs per #999's
    // two-column intro. No callout field: Fabri asked the closing callout
    // removed, so there is nothing to migrate it into.
    bodyBrokenPipe: z.object({
      heading: z.string().min(1),
      paragraphs: z.array(z.string().min(1)).length(2),
      photoCaption: z.string().min(1).default("[FOTO DE UN TRABAJO REAL]"),
      diagramLabels: z.object({
        withoutTramo: z.string().min(1),
        withTramo: z.string().min(1),
      }),
    }).optional(),

    // "Cómo cotizamos" + "Cuánto tarda", merged per #999 into one
    // two-column section. `durationValue`/`durationUnit`/`rows` are
    // optional because only palermo's source text carries the duration
    // stat verbatim as of this schema landing (see #991/#1000): the
    // component must render correctly with them absent.
    bodyQuote: z.object({
      heading: z.string().min(1),
      paragraphs: z.array(z.string().min(1)).min(1),
      calloutText: z.string().min(1),
      ctaText: z.string().min(1),
      durationValue: z.string().min(1).optional(),
      durationUnit: z.string().min(1).optional(),
      rows: z.array(z.object({
        icon: z.string().min(1),
        label: z.string().min(1),
      })).min(1).max(3).optional(),
    }).optional(),
  }),
});

export const collections = {
  services,
  locations,
};