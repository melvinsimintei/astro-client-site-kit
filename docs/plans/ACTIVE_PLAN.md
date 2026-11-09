<!-- Written by .claude/hooks/plan-capture.js on plan approval. Set the Status line to `done` when the plan is finished. -->
Status: done
Approved: 2026-11-09T09:20:49.353Z

# Make claude-mem, graphify, ponytail and research-first rules hold in every kit clone

## Context
Question: will a project cloned from this kit really use claude-mem, graphify, ponytail (for executing approved plans) and last30days (plus other research methods)?

What's already there:
- **On this machine: mostly yes.** `~/.claude/settings.json` turns on `ponytail`, `claude-mem` and `last30days` for every repo. `graphify` is a user skill, and the `graph-first.js` hook is user-scope. Your global `~/.claude/CLAUDE.md` holds the token-saving lookup order.
- **The kit's `CLAUDE.md`** has the Skills/token rules and the model-routing table. `/kickoff` step 11 opens a claude-mem phase list. `docs/KIT.md` lists the plugins as machine setup.

Gaps:
1. **Nothing is set at repo level.** The kit's `.claude/settings.json` has no `enabledPlugins` and no `extraKnownMarketplaces`. A clone on another laptop, or after a reinstall, quietly runs without ponytail, claude-mem or last30days.
2. **Ponytail isn't tied to plan approval.** It runs because the plugin's SessionStart hook turns it on. When a plan is approved, nothing says "now run it under ponytail full, track the phases in work_state, and finish with `/ponytail-review`".
3. **Research has no order.** The routing table lists `WebSearch, deep-research, last30days, Playwright` side by side. No rule says last30days goes first for what people are saying, or that verified facts (NAP, licensing, hours) need primary sources.
4. **Nothing checks the tools exist.** `/kickoff` never checks whether the plugins, the graphify skill or the CLI are installed.
5. **Your global rules only partly cover this.** `~/.claude/CLAUDE.md` covers memory and graph, but not ponytail-on-approval or research-first. Those apply to every project, not only kit clones.

## Changes

### 1. Declare the plugins at project level: `.claude/settings.json`
Add `enabledPlugins` (`ponytail@ponytail`, `claude-mem@thedotmack`, `last30days@last30days-skill`: true) and `extraKnownMarketplaces` (`DietrichGebert/ponytail`, `thedotmack/claude-mem`, `mvanhorn/last30days-skill`). The values come from `~/.claude/plugins/known_marketplaces.json`. Claude Code then offers to install them when a clone is trusted on any machine. This does nothing extra on this laptop, where they're already on.

### 2. Tie ponytail to plan approval: `.claude/hooks/plan-capture.js`
After writing ACTIVE_PLAN.md, print a PostToolUse `additionalContext` line, the same JSON shape `graph-first.js` uses:
"Plan approved: execute every phase under ponytail full (lite for copy/docs); track the phases with claude-mem `work_state_write`; end with `/ponytail-review` + `/ponytail-debt`, then recommend `/review`."
It stays best-effort and always exits 0. Add one assert to the self-check the same way `graph-first.js --test` does, or extend `pre-tool-use.test.mjs` if that's where hook tests live.

### 3. Research order and plan execution: kit `CLAUDE.md`
- In **Skills and token rules**, add a **research** line: "Start with `/last30days` for what patients and competitors are saying. Then WebSearch (standard, extended only when thin), deep-research for multi-source reports, Playwright for GBP and live sites, and the clinic skills (`nairobi-clinic-benchmark`, `clinic-demo-intake`) when they fit. Facts that go into `site.js` need a primary source. last30days chatter goes to the confirm ledger, never into Clinic configuration."
- In **Session Rules**, extend the approved-plan bullet: "...executed under ponytail full, phases tracked in `work_state_write`."
- Update the `session-start.js` Session Rules string (line ~30) by one clause to match.

### 4. Tool check in `/kickoff`: `.claude/commands/kickoff.md`
Add a step after Guards that warns but never blocks. Read `enabledPlugins` in `~/.claude/settings.json` for the three plugins and check that `~/.claude/skills/graphify` exists. List anything missing, with the install command from `docs/KIT.md`.

### 5. `docs/KIT.md`
- Machine setup: add install commands (`/plugin marketplace add …`, `/plugin install …`, graphify skill and CLI). Note that the project settings now prompt for these.
- Changelog line.

### 6. Global rules: `~/.claude/CLAUDE.md` (outside the repo, all projects)
Add two lines under "Token-saving defaults":
- "Approved plan → execute under ponytail full; to-dos in claude-mem `work_state_write`; end with `/ponytail-review`."
- "Research → `/last30days` first for current chatter, then WebSearch / deep-research / Playwright as needed; facts need primary sources."

Skipped on purpose: a graphify hook or setting in the kit. The 150-file rule and the global `graph-first.js` already cover it, and building graphs for small repos costs tokens.

## Verification
- `npm test` (hook tests, including the new plan-capture assert) and `npm run build` pass clean.
- Pipe a fake ExitPlanMode payload into `plan-capture.js` and confirm it writes ACTIVE_PLAN.md and prints the reminder JSON. Then restore the stub.
- Run `node .claude/hooks/session-start.js` and confirm the rules string includes the ponytail clause.
- Fresh-copy check from `docs/KIT.md` step 4: in a scratch clone, `/plugin` lists the three as declared by the project.
- Client-name leak grep: zero hits.
