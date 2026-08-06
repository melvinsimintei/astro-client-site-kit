# Client intake — [CLIENT NAME]

Fill this in once per new client engagement, before writing any code. This is
the document structure a prior client project used to think through its own
brief — the section headers and the *kind* of question each one answers are
what's reusable here, not any answer that was ever filled in. Answering this
fresh every time is what keeps a new client's site from defaulting to
whatever the last client had.

## What this is

One paragraph: what is this site for, and what is it explicitly NOT (not a
blog, not a full company site, not a one-page landing page unless that's
genuinely the right call for this client)? What's the single job the site
needs to do that everything else gets judged against?

## Success criteria

What does a visitor need to believe or do by the time they leave the site,
for the site to have worked? List 3-5 concrete beliefs/actions. Use this
later as the check for whether a design or content decision is actually
working, not just whether it looks good in isolation.

## Audience

- **Primary:** who is this, and what context are they arriving from (warm
  referral, mid-conversation, cold search)?
- **Secondary:** is there a meaningfully different second audience? Does the
  site need to make sense with zero prior context for them?

## Experience goals the architecture must achieve

What must a visitor be able to do, concretely? (e.g. "get the fast trust
check without wading through deep explanation," "get real depth on how X
works if they want it," "a single clear CTA present wherever it's relevant.")
This is what determines page count and structure — don't default to a single
page for build speed, and don't add pages that don't serve a clear goal.

## Content blocks that need a home

List every distinct piece of content the site needs to carry (a hero/entry
point, proof, an explanation of how the offering works, any lead magnet or
conversion mechanism, guarantees/trust statements, a closing CTA, whatever is
specific to this client). For each: is the actual copy ready, or does it need
to be drafted and flagged for the client's review before being treated as final?

## Design philosophy

Three words that describe the brand's personality. What archetype or feeling
is being aimed for? What should this NOT look like (anti-references — other
categories or styles this needs to avoid reading as)? This is what src/styles/
global.css's radius/shadow/motion values should be reconsidered against — see
that file's header comment.

## Visual system

- **Color:** this client's own locked palette — record it here, then fill it
  into src/config/site.js and src/styles/global.css's `:root` block, replacing
  the starter's `#ff00ff` sentinel values.
- **Type:** this client's own locked font system — record it here, self-host
  and subset the actual files, then replace the starter's system-font-stack
  defaults in global.css.
- **Imagery:** real photography, interface mockups, or something else —
  decide per this client, don't default to whatever a prior client used.
- **Restraint / motion:** any specific rules for this client (gradients or
  not, decorative motion or not) — don't inherit a prior client's "flat, no
  shadow" rule as if it's universal; decide it here.

## Brand guardrails specific to this client

Positioning and voice decisions that are this client's own (see CLAUDE.md's
"Business/Positioning Guardrails" section) — record the actual decisions
here so CLAUDE.md can summarize them accurately.

## Mobile

What's the primary traffic source (a link in WhatsApp, a Google search
result, a QR code, something else)? Which specific components need real
mobile-specific layout work, not just automatic resizing?

## SEO and discoverability

- Proper `<title>` and meta description per page
- `sitemap.xml` generated (already wired via astro.config.mjs's sitemap integration)
- OpenGraph tags for link previews
- Does this client need a single fixed local-search keyword (a local-SEO
  landing page) or not (a multi-page authority/proof site)? Don't assume
  either — this determines how src/lib/schema.js and the SEO checklist in
  .claude/agents/code-reviewer.md should be applied.

## Build in milestones

Don't build the whole site in one pass. Propose milestones (e.g. tokens/nav/hero
first, then core content sections, then closing/guarantee sections) and review
after each one before continuing.
