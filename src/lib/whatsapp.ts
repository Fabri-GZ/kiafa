// Single source for every wa.me link on the site.
//
// Before this existed the number was hardcoded in four components and three of
// them carried a different prefilled message, while BodyQuote's "Coordinar por
// WhatsApp" button was not a wa.me link at all — it jumped to <Contact />.
//
// The message names the barrio when the page knows it, so a lead arriving from
// /destapaciones-belgrano does not have to type where they are. Pages that have
// no barrio (the home) fall back to the generic sentence.

export const WHATSAPP_NUMBER = "541154298197";

const BASE = "Hola, vengo del sitio web. Necesito un servicio de destapación";

/**
 * Builds a wa.me deep link with a prefilled message.
 *
 * `encodeURIComponent` is what the message needs: wa.me reads `text` as a
 * query parameter, so the accents and the period have to survive as percent
 * escapes rather than being dropped.
 */
export function whatsappHref(barrio?: string): string {
  const message = barrio ? `${BASE} en ${barrio}.` : `${BASE}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
