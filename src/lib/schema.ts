// Typed JSON-LD node builders for the site's structured data graph.
// No node builder here emits aggregateRating, and none may be added.
// See src/lib/reviews.ts for the reason: getReviews() filters stars >= 4
// and must never be used to compute a rating figure.

export const SITE = "https://kiafadestapaciones.com.ar";
// Home URL carries the trailing slash so it matches sitemap.xml.ts exactly.
export const HOME_URL = `${SITE}/`;
export const ORG_ID = `${SITE}/#business`;

// Single source of truth for business hours: both the JSON-LD
// openingHoursSpecification below and the visible HOURS_TEXT_ES copy
// rendered by HoursCard.astro read the same numbers, so they can never
// drift apart. Day names ("lunes a viernes" / "Monday".."Friday") stay
// duplicated strings, kept in proximity in this same file.
export const HOURS = {
  weekday: { opens: "08:00", closes: "17:00" },
  saturday: { opens: "08:00", closes: "13:00" },
};

const hour = (time: string) => Number(time.slice(0, 2));

export const HOURS_TEXT_ES = `Atendemos de lunes a viernes de ${hour(HOURS.weekday.opens)} a ${hour(HOURS.weekday.closes)} h y sábados de ${hour(HOURS.saturday.opens)} a ${hour(HOURS.saturday.closes)} h.`;

export function plumberNode() {
  return {
    "@type": "Plumber",
    "name": "Kiafa Destapaciones",
    "image": `${SITE}/logo-kiafa.webp`,
    "@id": ORG_ID,
    "url": HOME_URL,
    "telephone": "+541154298197",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida General Paz 11916",
      "addressLocality": "Liniers",
      "addressRegion": "CABA",
      "postalCode": "1408",
      "addressCountry": "AR",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -34.65443441598698,
      "longitude": -58.5267015325151,
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        "opens": HOURS.weekday.opens,
        "closes": HOURS.weekday.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": HOURS.saturday.opens,
        "closes": HOURS.saturday.closes,
      },
    ],
    "sameAs": [
      "https://www.instagram.com/kiafa_destapaciones/",
      "https://www.linkedin.com/in/kiafa-destapaciones-676a3553",
      "https://www.facebook.com/KIAFADESTAPACIONES",
    ],
    "areaServed": [
      {
        "@type": "City",
        "name": "Buenos Aires",
      },
      {
        "@type": "State",
        "name": "Gran Buenos Aires",
      },
    ],
    "serviceType": [
      "Destapaciones de cañerías",
      "Destapaciones cloacales",
      "Destapaciones de baños",
      "Destapaciones de cocinas",
      "Destapaciones pluviales",
      "Destapaciones de columnas",
    ],
  };
}

export function serviceNode({
  canonical,
  areaName,
}: {
  canonical: string;
  areaName: string;
}) {
  return {
    "@type": "Service",
    "@id": `${canonical}#service`,
    "serviceType": "Destapaciones",
    "provider": { "@id": ORG_ID },
    "areaServed": {
      "@type": "Place",
      "name": areaName,
    },
  };
}

export function breadcrumbNode({
  canonical,
  name,
}: {
  canonical: string;
  name: string;
}) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${canonical}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": HOME_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": name,
        "item": canonical,
      },
    ],
  };
}

// Used starting in slice 2, when localFaqs is populated. Stubbed here so
// schema.ts's public surface is stable across both slices.
export function faqNode({
  canonical,
  faqs,
}: {
  canonical: string;
  faqs: { question: string; answer: string }[];
}) {
  return {
    "@type": "FAQPage",
    "@id": `${canonical}#faq`,
    "about": { "@id": ORG_ID },
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };
}

export function jsonLdGraph(nodes: object[]): string {
  const graph = {
    "@context": "https://schema.org",
    "@graph": nodes,
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}
