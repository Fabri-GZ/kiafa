// Curated 4-entry subset of the structured body sections, feeding the
// navbar dropdown (wired in slice 5). This is NOT a complete registry of
// every body section: `bodyCauses`, `bodyBrokenPipe` and `bodyQuote` are
// deliberately excluded — the dropdown is specified at exactly 4 children
// (product decision). Do not "fix" this by adding the missing three.
//
// The full canonical page order, rendered by the seven literal
// {data.bodyX && <BodyX ... />} conditionals in src/pages/[slug].astro, is:
//   bodyServices → bodyCauses → bodyBrokenPipe → bodyQuote →
//   bodyPrevention → bodyMethod → bodyFaq
// This array's entries must keep their RELATIVE order matching that
// canonical order (bodyServices, bodyPrevention, bodyMethod, bodyFaq), and
// each `id` must equal the `id` actually rendered by the matching
// component (BodyServices.astro, BodyPrevention.astro, BodyMethod.astro,
// BodyFaq.astro) — ids are now part of the sync contract, not just order.
//
// Drift is silent: no build error and no type error, invisible until
// someone clicks the dropdown. [slug].astro's body-block comment names
// this file back as the paired order-of-truth; edit both in the same
// commit.
//
// Kept as two hand-written sources rather than one lookup-table map on
// purpose: a literal conditional per section is the same gating pattern
// already used for hasBody and nearby.length > 0, and it keeps
// [slug].astro provably inert for the 29 pages that carry none of these
// fields. A `.map()` over this curated 4-entry subset also could not
// render the other three sections at all, so a lookup table would not even
// solve the problem here.
export const BODY_SECTIONS = [
  { field: "bodyServices",   id: "servicios",  label: "Qué destapamos" },
  { field: "bodyPrevention", id: "prevencion", label: "Qué cuidar" },
  { field: "bodyMethod",     id: "metodo",     label: "Cable y punta" },
  { field: "bodyFaq",        id: "faq",        label: "Preguntas del barrio" },
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
