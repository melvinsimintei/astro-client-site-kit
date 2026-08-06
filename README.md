# astro-client-site-kit

A clone-ready Astro starter for client sites, built with Web3Forms, Netlify,
and Claude Code.

**Multi-page first.** The previous generation of this starter
(`astro-landing-template`) assumed a single scrolling page, because it was
generalized from one client's single-page build. That assumption doesn't
hold — client sites built from this starter may be single-page or multi-page
depending on what the actual brief calls for, and nothing here should
pre-decide that. Propose a page architecture per client (see
`docs/CLIENT_INTAKE_TEMPLATE.md`); don't default to one long page for build
speed, and don't assume a fixed multi-page shape either.

## The `src/` vs `docs/patterns/` split — read this before reusing anything

Everything in `src/` is live, generic infrastructure — tooling, plumbing,
accessibility primitives, a token *architecture* — safe to build on directly.

Everything in `docs/patterns/` is a **non-live reference**: real, working
code from a prior client project, kept here because the *technique* (a
numbered-rail section, a responsive nav pattern, a ledger-style list) is
worth not re-deriving from scratch — but never imported by anything in
`src/`, and never meant to be. That prior client's specific layout and
visual treatment is not a neutral default; reusing it as-is would quietly
carry their brand's visual personality into a new client's site, even after
colors are swapped. Read a pattern file for the idea, then build the real
thing fresh against the new client's own brief and brand guidelines.
`.claude/commands/audit.md` checks that nothing under `docs/patterns/` ever
gets imported into `src/` — that check failing is a real signal something
was copy-pasted instead of rebuilt.

The same split-in-spirit applies inside `src/styles/global.css` itself: the
reset, accessibility utilities, and the `[data-reveal]` progressive-
enhancement mechanism are genuine infrastructure. The `:root` color tokens
ship as an unmissable `#ff00ff` placeholder (not a "safe" default) and the
font tokens ship as neutral system-font stacks (not a specific typeface) —
see that file's header comment for the full reasoning, including why radius/
shadow/motion values need the same deliberate reconsideration as colors do,
not just a recolor.

## What this starter includes

- `.claude/agents/codebase-explorer.md` — read-only exploration agent, with
  a fill-in-per-client "Project Context" block and a large reusable
  persistent-memory-system prompt
- `.claude/agents/code-reviewer.md` — judge-only review agent, with a single
  consolidated "Project-Specific Checklist" section to edit per client
  instead of hunting through the whole file for brand leaks
- `.claude/commands/explore.md`, `review.md`, `ship.md` — generic workflow commands
- `.claude/commands/audit.md` — full project health check, including a check
  that the starter's placeholder sentinel values were actually replaced
- `.claude/commands/verify-live.md` — live browser test via Playwright MCP
- `.claude/hooks/pre-tool-use.js` — blocks git push, rm -rf, npm install (inside the reviewer agent)
- `.claude/hooks/session-start.js` — injects workflow rules into Claude at session start
- `src/config/site.js` — per-client config, including a `market` flag that
  gates which locale-specific checks actually apply (see its header comment)
- `src/lib/schema.js` — organization/website/breadcrumb JSON-LD, the three
  schema types every business genuinely has; see `docs/patterns/schema-examples.js`
  for a named-service/free-offer pattern that's NOT a universal default
- `src/components/LeadForm.astro`, `BrowserFrame.astro` — the two components
  kept live; everything else with a real layout opinion moved to `docs/patterns/`
- `docs/CLIENT_INTAKE_TEMPLATE.md` — the intake document skeleton to answer
  fresh for every new client, before writing any code
- `MEMORY.md`, `KNOWN_ISSUES.md` — carried-forward operational knowledge (Safari
  iOS phone-regex bug, Windows Git Bash gotchas, workflow rules)

## How to start a new client project

1. Clone this repo into a new, separate repo per client — don't build inside this starter repo itself.
2. `npm install`
3. Copy `.env.example` to `.env` and fill in the real Web3Forms key and (once one exists) the site URL.
4. Answer `docs/CLIENT_INTAKE_TEMPLATE.md` for this specific client.
5. Fill in `CLAUDE.md`'s `[PLACEHOLDER]`s from those answers.
6. Fill in `src/config/site.js` (including `market`).
7. Replace `src/styles/global.css`'s `#ff00ff` color tokens and system-font
   stacks with this client's own locked visual system — and reconsider the
   radius/shadow/motion values against their Design Philosophy answer, not
   just the colors.
8. Fill in the "Project Context" block in `.claude/agents/codebase-explorer.md`
   and the "Project-Specific Checklist" in `.claude/agents/code-reviewer.md`.
9. Build the header/footer and any other page-specific components fresh —
   read `docs/patterns/` for technique ideas, don't import from it.
10. Follow: `/explore` → plan → code → `/review` (fresh session) → `/ship "message"` → push manually.
11. Before shipping, run `/audit` — it checks for leftover placeholders,
    unreplaced sentinel colors, and any accidental `docs/patterns/` import.

For a worked example of good, filled-in answers (not a template to copy
from), see a completed prior client project in a sibling `client-projects/`
folder — read it for the *shape* of good answers, not the answers themselves.

## Stack

- Astro (static site generator)
- Netlify (hosting)
- Web3Forms (form submissions)
- Claude Code (AI-powered development)
- Playwright MCP (live browser testing)
- GitHub Actions (automatic build checks)
