// Typed JSON-LD node builders for the site's structured data graph.
// No node builder here emits aggregateRating, and none may be added.
// See src/lib/reviews.ts for the reason: getReviews() filters stars >= 4
// and must never be used to compute a rating figure.

export const SITE = "https://kiafadestapaciones.com.ar";
export const ORG_ID = `${SITE}/#business`;

export function plumberNode() {
  return {
    "@type": "Plumber",
    "name": "Kiafa Destapaciones",
    "image": `${SITE}/logo-kiafa.webp`,
    "@id": ORG_ID,
    "url": SITE,
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
        "opens": "08:00",
        "closes": "17:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "13:00",
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
      "Destapaciones 24 horas",
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
        "item": SITE,
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
