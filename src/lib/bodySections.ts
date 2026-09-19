// Ordered registry of the structured body sections rendered by
// src/pages/[slug].astro (BodyServices, BodyMethod, BodyPrevention,
// BodyFaq). This is one of two places section order lives — the other is
// the four literal {data.bodyX && <BodyX ... />} conditionals in
// [slug].astro, which must stay in this same order. Kept as two
// hand-written sources rather than one lookup-table map on purpose: a
// literal conditional per section is the same gating pattern already used
// for hasBody and nearby.length > 0, and it keeps [slug].astro provably
// inert for the 29 pages that carry none of these fields.
export const BODY_SECTIONS = [
  { field: "bodyServices",   id: "que-destapamos", label: "Qué destapamos" },
  { field: "bodyMethod",     id: "metodo",         label: "Cable y punta" },
  { field: "bodyPrevention", id: "prevencion",     label: "Qué cuidar" },
  { field: "bodyFaq",        id: "faq-barrio",     label: "Preguntas del barrio" },
] as const;

type BodyData = Record<string, { items?: unknown[] } | undefined>;

// Feeds only the navbar dropdown (wired in slice 5). A field with a
// present-but-empty items array cannot exist because the zod schema's
// .min(1) forbids it, so the length check here is defensive, not load
// bearing.
export function deriveBodySections(data: BodyData) {
  return BODY_SECTIONS
    .filter((s) => (data[s.field]?.items?.length ?? 0) > 0)
    .map(({ id, label }) => ({ id, label }));
}
