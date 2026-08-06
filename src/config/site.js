// Fill this in once per client project. Nothing here should still say
// [PLACEHOLDER] by the time a site ships — audit.md's PLACEHOLDER CHECK scans
// for these bracket tokens across src/, this file included.
//
// Why `market` exists: some checks in .claude/commands/audit.md and
// verify-live.md (phone number format, WhatsApp link format) are only true for
// Kenyan clients — the real target market for most projects built from this
// starter, but not a universal rule. Those checks read `market` and mark
// themselves N/A instead of failing when a project falls outside that market.
// This makes "this check doesn't apply to you" a structural fact instead of
// something a human has to remember to discount under deadline pressure.

export const site = {
  // Used in <title> composition and og:site_name — see src/layouts/Layout.astro
  name: '[CLIENT NAME]',

  // One line, used in schema.js's organizationSchema/websiteSchema descriptions
  description: '[WHAT THE CLIENT DOES, ONE SENTENCE]',

  // "KE" gates the Kenya-specific checks described above. Set to something else
  // (or leave as [PLACEHOLDER]) for a client outside that market — do not leave
  // it defaulted to "KE" without checking it's actually true for this client.
  market: '[PLACEHOLDER]',

  // ISO 4217 currency code, used only if a schema.js Offer/Service needs a price —
  // see docs/patterns/schema-examples.js for that pattern, not shipped by default.
  currency: '[PLACEHOLDER]',
};
