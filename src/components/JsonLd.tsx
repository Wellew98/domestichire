import Script from "next/script";

/**
 * Renders a JSON-LD structured data script tag.
 * Injects into the page <head> via next/script strategy="beforeInteractive" or afterInteractive.
 */

type JsonLdProps = {
  data: Record<string, unknown>;
  id?: string;
};

export default function JsonLd({ data, id }: JsonLdProps) {
  return (
    <Script
      id={id || "jsonld"}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema for the homepage */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DomesticHire",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://domestichire-psi.vercel.app",
    description:
      "Zimbabwe's trusted platform for finding and hiring domestic workers — maids, nannies, drivers, gardeners, cooks, chefs, cleaners, and nurse aides.",
    email: "info@domestichire.co.zw",
    telephone: "+263 77 000 0000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    sameAs: [
      "https://domestichire-psi.vercel.app",
    ],
  };
}

/** LocalBusiness schema */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "DomesticHire",
    description:
      "Domestic worker recruitment and placement services in Zimbabwe.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://domestichire-psi.vercel.app",
    telephone: "+263 77 000 0000",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    priceRange: "$150 - $500",
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
