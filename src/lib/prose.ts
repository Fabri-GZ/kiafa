// Shared parser for mid-sentence bold markers inside plain, non-markdown
// proseBlock/row fields (see src/content/config.ts — these fields
// deliberately don't render as markdown). Extracted so BodyQuote.astro can
// reuse it instead of duplicating the logic.
//
// Body copied verbatim from src/components/BodyMethod.astro:27-35, no
// behavior change — it is already generic across N `**bold**` markers.
// BodyMethod.astro keeps its own local copy for now because that file is
// uncommitted, in-flight work on `feat/body-method-redesign`; once that
// branch commits, its local `renderBoldSegments` should be deleted and
// replaced with an import from this module.
export function renderBoldSegments(text: string): { bold: boolean; text: string }[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((segment) => segment.length > 0)
    .map((segment) => {
      const match = segment.match(/^\*\*([^*]+)\*\*$/);
      return match ? { bold: true, text: match[1] } : { bold: false, text: segment };
    });
}
