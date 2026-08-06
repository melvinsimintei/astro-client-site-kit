# Project: [CLIENT NAME] — Website

Fill in per client. Start from docs/CLIENT_INTAKE_TEMPLATE.md, answer it for
this specific client, then summarize the answers into the sections below —
don't leave this file as the empty skeleton once real work starts. See the
README for a pointer to a worked-example CLAUDE.md from a prior client
project (not copied here — read it for the *shape* of good answers, not the
answers themselves).

See @[BUSINESS_CONTEXT_FILE].md for the full offer, brand, and business context.
See @[WEBSITE_BRIEF_FILE].md for this build's specific page brief and requirements.

## Page Structure
[PLACEHOLDER — is this single-page or multi-page? Don't assume either by
default; decide it per this client's brief.]
Before writing any code, propose a page list with reasoning, based on this
client's business context, and wait for approval.

## Design Rules
- Mobile-first by default (confirm this still matches the client's actual audience)
- Use this client's own locked color and font system — see docs/CLIENT_INTAKE_TEMPLATE.md's
  Visual System section for where that gets recorded. Do not introduce colors or fonts
  outside what's locked there, and do not default to a prior client's palette or type system.
- [PLACEHOLDER — real photography, interface mockups, or another treatment? Decide
  per this client's brief; "real photos only, no stock imagery" is a reasonable
  default if photography is used at all, but confirm the site's actual approach first.]

## Technical Requirements
- Astro framework, no JavaScript framework on top
- Forms submit to [PLACEHOLDER — confirm the actual provider for this client]
- All images optimized via Astro Image component
- Performance target: [PLACEHOLDER, if this client has a specific one]

## Brand Guardrails — universal defaults, keep unless this client's brief says otherwise
These carry forward from prior client work because they're baseline craft/ethics
standards, not one client's specific sales-funnel decisions:
- No fabricated social proof: no invented client counts, no fake testimonials, no numbers that aren't real
- No stock imagery if real photography is used at all
- Mobile-first as a default, not an edge case to handle later

## Business/Positioning Guardrails — DO NOT copy from a prior client, fill in fresh
These are this client's own strategic choices, not universal rules. A prior client's
answers here (e.g. "no pricing shown," "speaks as we, not a named founder") were
specific to their positioning — don't assume they apply here without checking this
client's own brief:
- [PLACEHOLDER — how does this client want to be voiced? Named founder, "we", something else?]
- [PLACEHOLDER — is pricing/bonuses/scarcity shown on-site, or handled off-site like a prior client did? Don't assume.]
- [PLACEHOLDER — any category the client explicitly does NOT want to be framed as?]

## Session Rules
- Never run git add, git commit, or git push automatically
- After completing any code change, stop and wait for my approval
- When I say "commit this with message X" — use that exact message
- When I say "push" — then push to main
- Always invoke the codebase-explorer agent before making changes
- Always invoke the code-reviewer agent after making changes
