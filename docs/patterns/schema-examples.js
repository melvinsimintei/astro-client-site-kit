// REFERENCE ONLY — not imported anywhere in src/, not part of the build.
//
// src/lib/schema.js ships organizationSchema/websiteSchema/breadcrumbSchema
// by default, because every business genuinely has an org, a website, and a
// breadcrumb trail. This file shows the shape we used for ONE client that
// had a named, productized service AND a free lead-magnet offer worth their
// own Service/Offer schema types — not every future client's offering will
// look like this. Write the real schema fresh per client's actual business
// model; don't fill these in as if they're a required part of the template.

export function exampleNamedServiceSchema(site, config) {
  return {
    '@type': 'Service',
    '@id': `${site}#service`,
    serviceType: config.serviceType, // e.g. "Dental clinic patient acquisition and authority system"
    provider: { '@id': `${site}#organization` },
    name: config.name,
    description: config.description,
    url: `${site}${config.urlPath}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: config.name,
      itemListElement: config.offers.map((offer) => ({
        '@type': 'Offer',
        name: offer.name,
        description: offer.description,
        price: offer.price, // '0' if genuinely free — never fabricated
        priceCurrency: config.currency,
        url: `${site}${offer.urlPath}`,
      })),
    },
  };
}

export function exampleFreeOfferSchema(site, config) {
  return {
    '@type': 'Service',
    '@id': `${site}${config.urlPath}#service`,
    serviceType: config.serviceType,
    provider: { '@id': `${site}#organization` },
    name: config.name,
    description: config.description,
    url: `${site}${config.urlPath}`,
    offers: {
      '@type': 'Offer',
      price: config.price,
      priceCurrency: config.currency,
      availability: 'https://schema.org/InStock',
    },
  };
}
