// Structured data (schema.org JSON-LD) so search engines and AI agents/answer
// engines can accurately summarize the client without guessing. Every value
// passed in must be real — no fabricated ratings, reviews, or claims. Only
// used once a real `site` URL exists (see astro.config.mjs); a guessed domain
// in structured data would be worse than none at all, same reasoning as the
// canonical URL guard in Layout.astro.
//
// Only the three schema types every business genuinely has ship here by
// default: an organization, a website, and breadcrumbs. A prior version of
// this file also shipped a named "productized system" Service schema and a
// free-offer Offer schema — those encoded one client's specific offering
// shape (a named system + a free lead magnet), which won't fit every future
// client (hourly work, a single service, a product catalog...). See
// docs/patterns/schema-examples.js for that pattern as a worked reference,
// not a default export — write the real schema fresh per client's actual
// offering.

export function organizationSchema(site, config) {
  return {
    '@type': 'Organization',
    '@id': `${site}#organization`,
    name: config.name,
    url: site,
    logo: {
      '@type': 'ImageObject',
      url: `${site}logo.svg`,
    },
    description: config.description,
  };
}

export function websiteSchema(site, config) {
  return {
    '@type': 'WebSite',
    '@id': `${site}#website`,
    url: site,
    name: config.name,
    publisher: { '@id': `${site}#organization` },
    inLanguage: 'en',
  };
}

export function breadcrumbSchema(site, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site}${item.path}`,
    })),
  };
}
