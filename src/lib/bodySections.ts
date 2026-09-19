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

type BodyData = Record<string, object | undefined>;

// Feeds only the navbar dropdown (wired in slice 5). Presence of the field
// object is the gate now, not an items-array length check: bodyServices no
// longer carries an `items` array in content at all (see
// SHARED_SERVICE_ITEMS below), and the other three fields' `items` are
// still required by their zod schema whenever the object itself is
// present, so a plain presence check is equivalent for them too.
export function deriveBodySections(data: BodyData) {
  return BODY_SECTIONS
    .filter((s) => data[s.field] !== undefined)
    .map(({ id, label }) => ({ id, label }));
}

// Canonical "qué destapamos" list, identical on every barrio page — per
// #1002 decision 2, it's the same seven items in the same order everywhere
// because it's the same work everywhere. Previously copied into each
// location's frontmatter; that copy already drifted once (belgrano had 6
// items, palermo 7, purely from being separate copies), so this is now the
// single source BodyServices.astro reads directly. Only `heading`, `lead`
// and `note` still vary per barrio in bodyServices frontmatter.
export const SHARED_SERVICE_ITEMS = [
  "Ramales internos",
  "Cloacas y cámaras de inspección",
  "Pluviales y desagües de lluvia",
  "Baños, inodoros y piletas",
  "Cocinas, incluidas cocinas comerciales",
  "Rejillas y piletas de patio",
  "Columnas en edificios",
] as const;
