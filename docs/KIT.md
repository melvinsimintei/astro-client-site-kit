# astro-client-site-kit

A clone-ready **workflow** kit for client sites (Astro, Netlify, Web3Forms, Claude Code).
It carries the machinery that makes execution fast and safe: hooks, permissions, agents,
commands and rules. It deliberately carries **no site code, no design system and no client
content**. Every client site is written from scratch against that client's own research and brand.

This file is the kit's own documentation. `/kickoff` deletes it in a client repo, where README.md
describes the client's site. The rule: **a client repo starts with the kit's tools and nothing
else**: no kit history, no kit plans, no other client's names, no notes from this machine.

## Start a new client

1. On GitHub, open the kit and click **Use this template** (the kit's Settings must have
   "Template repository" ticked, once). Name the new repo after the client, clone it into
   `client-projects/`, then `npm install`. This gives the client fresh git history.
   Without GitHub: `git clone` the kit, delete its `.git` folder yourself, then `git init`.
   Never copy the kit folder: it would carry `.env`, agent notes and local settings.
2. In Claude Code: `/kickoff "Client Name" client-slug [live-url]`. It checks the repo is clean, fills
   README.md, CLAUDE.md's title, `site.js` name, package.json, STATUS.md and `public/`, deletes this
   file, creates `.env`, adds the name to `~/.claude/client-names.txt` and opens a claude-mem phase list.
3. Fill CLAUDE.md's `[PLACEHOLDER]` blocks from research (on Opus), never from a prior client.
4. Work the loop: plan mode → approve (the plan is saved automatically) → build → `/ponytail-review`
   → `/review` in a fresh session → `/ship "message"` → push from your own terminal.
5. Before handing over or pitching: `/audit`.

## What's inside

| Piece | What it does |
|---|---|
| `.claude/hooks/session-start.js` | On startup, `/clear` and compaction: injects STATUS.md, the active plan (until `Status: done`), live branch + git status and the Session Rules |
| `.claude/hooks/pre-tool-use.js` (+ test) | Blocks `git push` (even as text inside a shell command), asks before every `git commit`, blocks recursive force-deletes and printing `.env`, keeps the code-reviewer agent read-only |
| `.claude/hooks/plan-capture.js` | When a plan is approved, saves the plan from the approval payload to `docs/plans/ACTIVE_PLAN.md` (never from `~/.claude/plans`, which every repo shares). Older plans live in git history |
| `.claude/hooks/sync-status.js` | On Stop: nudges (never blocks) when work is uncommitted and STATUS.md is unchanged since the last commit. Writes nothing |
| `.claude/settings.json` | Wires the hooks; denies `.env` reads and `git push`; allows build/test/check/preview so long runs don't stall on prompts |
| `.claude/agents/code-reviewer.md` | Opus, judge-only: plan vs build, NAP single-source, dist banned words, `tel:` links, zoom, mobile-first, Astro Image |
| `.claude/agents/codebase-explorer.md` | Sonnet, read-only exploration; reads CLAUDE.md and STATUS instead of a per-client block |
| `.claude/commands/` | `/kickoff`, `/review`, `/audit`, `/ship`, `/explore`, `/verify-live` |
| `docs/plans/` | STATUS.md (hand-written narrative), ACTIVE_PLAN.md (stub until a plan is approved), archive/ |
| `src/` | A bare shell that builds, plus `src/config/site.js`: the one place for name, phone, WhatsApp, address, hours and the `publicLaunch` index switch |
| `KNOWN_ISSUES.md` | Safari phone-regex bug, Windows shell gotchas |
| CI | `.github/workflows/build-check.yml` runs the hook tests and the build on every push to main |

Because the hook blocks the words "git push" anywhere in a shell command, write files that
mention it with the Write tool, not a shell heredoc.

## Machine setup (once per laptop, not per repo)

- Playwright without prompts: `~/.claude/settings.json` → `"permissions": {"allow": ["mcp__playwright", "mcp__playwright__*"]}` and no `ask` entry for Playwright tools (`ask` beats `allow`).
- Playwright MCP lives at **user scope** (one server for every repo), pinned so `npx` doesn't re-resolve `@latest` on every start (that is what times out): `claude mcp remove playwright -s user` then `claude mcp add --scope user playwright -- npx -y @playwright/mcp@0.0.84`. Don't add a project `.mcp.json` for it: two scopes conflict.
- Plugins: ponytail, claude-mem, last30days. Skills: impeccable, graphify, emil-design-eng, apple-design.
- `CLAUDE_CODE_SUBAGENT_MODEL=sonnet` in user settings; agents that need Opus say so in their frontmatter.

## Updating the kit

Improve the kit when a client repo proves a better hook, rule or command. Copy only machinery,
never a component, stylesheet, palette, plan, STATUS text or client fact. Before committing a port:

1. `npm test` and `npm run build` (no warnings).
2. Client-name leak grep, zero hits. The names live in `~/.claude/client-names.txt`, one per line,
   on this machine only, never in a repo:
   `grep -rniwFf ~/.claude/client-names.txt --exclude-dir=node_modules --exclude-dir=.git --exclude=.env* .`
3. `docs/plans/ACTIVE_PLAN.md` is the "No active plan" stub and STATUS.md still says "Not kicked off yet".
4. Fresh-copy check: copy what a commit would ship (`git ls-files -co --exclude-standard`) to a scratch
   folder, then run `npm ci`, `npm test` and `npm run build` there.

## Changelog

- 2026-11-09: clean-start pass. Template-repo start with fresh history; `/kickoff` guards against
  copied folders and kit history, fills `site.js`/`public/`, deletes this file; client names moved to
  `~/.claude/client-names.txt`; STATUS.md is narrative only (no git snapshot, no plan log);
  plan-capture reads only the approval payload; `.env` switches load via `loadEnv`; reviewer may run
  `npm test`; tighter `.env` guard.
- 2026-11-09: workflow kit. Hooks, settings and agents ported from a client build; `/kickoff`;
  README becomes a client template; all site code, `docs/patterns/` and the intake template removed.
- (first commit): initial starter.
