// The ONE source for the clinic's name, contact details and hours. Header, footer, contact,
// booking, FAQ and JSON-LD read from here. A hand-typed phone, address or hours line
// anywhere else in src/ is a review BLOCKER (/audit 2b, code-reviewer checklist).
// Fill only from verified sources; leave a value '' until it is confirmed.

export const site = {
  name: '[CLIENT NAME]',
  phone: '',         // local format, e.g. '07XXXXXXXX' -> tel: link
  whatsapp: '',      // international digits, e.g. '2547XXXXXXXX' -> wa.me/<this>
  address: '',
  hours: [],         // e.g. [{ days: 'Mon–Fri', open: '08:00', close: '19:00' }]
  market: 'KE',      // gates Kenya checks: phone pattern [0-9]{10}, wa.me/254…
  // Indexing switch: stays false (noindex) until the owner says the site may go public.
  publicLaunch: import.meta.env.PUBLIC_LAUNCH === 'true',
};
