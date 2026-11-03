// Curated 3-entry subset of the structured body sections, feeding the
// navbar dropdown. This is NOT a complete registry: `bodyBrokenPipe`,
// `bodyQuote`, `bodyPrevention` and `bodyFaq` are deliberately excluded.
// Do not "fix" this by adding them.
//
// `bodyFaq` is out because "Preguntas frecuentes" stays a TOP-LEVEL navbar
// link on every page, barrio or not; putting it in the dropdown too would
// point two entries at `#faq`. The dropdown replaces only the standalone
// "Servicios" link, whose `#servicios` target now belongs to
// BodyServices.astro on a barrio page.
//
// The full canonical page order, rendered by the seven literal
// {data.bodyX && <BodyX ... />} conditionals in src/pages/[slug].astro, is:
//   bodyServices → bodyCauses → bodyBrokenPipe → bodyQuote →
//   bodyPrevention → bodyMethod → bodyFaq
// This array's entries must keep their RELATIVE order matching that
// canonical order (bodyServices, bodyCauses, bodyMethod), and each `id`
// must equal the `id` actually rendered by the matching component
// (BodyServices.astro, BodyCauses.astro, BodyMethod.astro) — ids are part
// of the sync contract, not just order.
//
// Labels are what a visitor reads cold, with no section in view. "Cable y
// punta" named the tools instead of the job and told nobody anything, so
// it follows the section's own heading, "Cómo trabajamos". "Por qué se
// tapan" matches its heading for the same reason.
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
// fields. A `.map()` over this curated subset also could not render the
// other four sections at all, so a lookup table would not even solve the
// problem here.
export const BODY_SECTIONS = [
  { field: "bodyServices", id: "servicios",        label: "Qué destapamos" },
  { field: "bodyCauses",   id: "por-que-se-tapan", label: "Por qué se tapan" },
  { field: "bodyMethod",   id: "metodo",           label: "Cómo trabajamos" },
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
