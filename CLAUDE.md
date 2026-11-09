# Project: [CLIENT NAME] — website

## Status
[PLACEHOLDER — one paragraph: what this site is, who it is for, whether it is a pitch built on spec
or a signed build, and what it must never be labelled (e.g. never "demo" or "sample" on-site).]

Current state and next steps: `docs/plans/STATUS.md` (auto-loaded at session start).
Every site is written from scratch: do not reuse code, classes, palettes or design-system files
from any other client repo.

## Session Rules
- Stage or commit only when I ask; every `git commit` waits for my approval (the PreToolUse hook asks). You may recommend a commit.
- Never git push. I always push to GitHub manually from my own terminal (the hook and settings block it).
- When I say "commit this with message X", use that exact message.
- Once I approve a plan, execute every phase in one run without stopping between phases, under ponytail full (lite for copy/docs), with the phases tracked in claude-mem `work_state_write`. Stop only when the whole plan is done, or when blocked by something the plan didn't anticipate (then ask). Outside an approved plan, stop after a code change and wait for my approval.
- Before planning or unplanned changes, explore with targeted Grep/Read yourself; invoke the codebase-explorer agent only when that can't answer it or I ask.
- Don't run the code-reviewer automatically. At the end of a pass, recommend `/review` (and say what it should focus on). Run it only when I ask.
- Approved plans are saved to `docs/plans/ACTIVE_PLAN.md` by a hook and re-injected at session start. When an approved plan is finished, set its `Status:` line to `done` and update the `docs/plans/STATUS.md` narrative.
- Update the narrative in `docs/plans/STATUS.md` when a pass completes.

## Model routing (switch with `/model`)
| Phase | Model | Skills / tools |
|---|---|---|
| Research (facts, competitors, patient worries, differentiators) | Opus | last30days first, then WebSearch, deep-research, Playwright |
| Design direction, page architecture, sitemap | Opus | impeccable (critique), emil-design-eng, apple-design |
| Foundation and page build | Opus | ponytail full |
| Content fill, copy batches, small touch-ups | Sonnet | ponytail lite |
| QA | Opus | impeccable audit, `/audit`, then `/review` (I run it) |

## Skills and token rules
- **research:** start with `/last30days` for what patients and competitors are saying now. Then use whatever fits: WebSearch (standard, extended only when thin), deep-research for multi-source reports, Playwright for GBP and live sites, the clinic skills (`nairobi-clinic-benchmark`, `clinic-demo-intake`). Facts in `site.js` need a primary source (GBP, the clinic's own site, a regulator register). last30days chatter goes to the confirm ledger, never into Clinic configuration.
- **ponytail:** `full` for code, `lite` for docs/prose. End of a build pass: `/ponytail-review`, then `/ponytail-debt` for `shortcut:` comments.
- **claude-mem:** `work_state_write` is the to-do list for every multi-step pass (open items resurface after `/clear`). `save_memory` only for durable decisions. `mem-search` only on cues ("last time", "did we").
- **graphify:** only once `src/` passes ~150 files; below that Grep is cheaper.
- **impeccable:** the design critique/audit and anti-slop gate for every UI pass.
- **Playwright MCP:** screenshots saved inside the repo (it can't write outside it); view many images as one contact sheet.
- `/clear` between passes, `/compact` before a long one.

## Clinic configuration
[PLACEHOLDER — verified facts only, each with its source: name, address, phone, WhatsApp, hours,
licensing, rating, services, people. Unverified items go to the confirm ledger, not here.]

All NAP/hours data lives in **one** file: `src/config/site.js`. Header, footer, contact, booking,
FAQ and JSON-LD read from it. A hand-typed phone, address or hours line anywhere else is a review BLOCKER.

## Design system
[PLACEHOLDER — the chosen structure source, this client's palette (sampled from their own photos,
logo and rooms) with measured contrast, fonts (self-hosted via Fontsource), departures and the
review greps. Decided after research, shown to me on a phone before pages are built.]
- **Mobile-first:** 375px first, then 768 / 1024 / 1280+. Tap targets ≥ 44px. Body 16px. No horizontal scroll.

## Content & voice
[PLACEHOLDER — voice (who speaks: "we" or a named lead), tone, pricing policy, insurance wording.]
Universal, keep unless I say otherwise:
- Never invent people, reviews, ratings, counts, awards or licences. No outcome promises ("pain-free guaranteed"). Emergencies: scoped wording, never "24/7".
- Every item that is not a verified fact gets a row in the confirm ledger (e.g. `docs/CONTENT_TO_CONFIRM.md`).
- JSON-LD never includes `aggregateRating`.
- Kenya (KMPDC Advertising Rules 2016): no superlatives, patient images only with consent, no AI likeness of a real named clinician.

## Imagery
[PLACEHOLDER — which real photos are usable, which must never appear, and whether AI images are allowed.]
Real photos first, all raster images via `astro:assets`; never shown larger than their real pixels.

## Tech
Astro static, no JS framework on top · plain CSS tokens · fonts self-hosted · Web3Forms (key from
`WEB3FORMS_ACCESS_KEY`) · LCP < 2.5s on mobile · `market: 'KE'`: phone pattern `[0-9]{10}` (never
`\d{10}`, see `KNOWN_ISSUES.md`), WhatsApp as `wa.me/254…`, one number sitewide. Indexing stays off
until `PUBLIC_LAUNCH=true`.

## QA gate (before calling a build pass done)
- `npm run build`, `npx astro check` and `npm test` clean.
- The design-system review greps → zero hits.
- Grep `dist/` for "demo", "lorem", "sample", "24/7", "pain-free" → zero hits.
- Every phone is a `tel:` link; one WhatsApp number; Book reachable from every page; dynamic copyright year; viewport never locks zoom.
- Every fill item has a row in the confirm ledger.
