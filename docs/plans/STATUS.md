# [CLIENT NAME] website — Live Status

> **Read this first.** This is the one "pick up here" file, loaded at every session start.
> It is hand-maintained: update it whenever a pass completes or before ending a session with
> uncommitted work (the `Stop` hook nudges, never blocks). Branch and git status are read live
> at session start, so they are not kept here. The approved plan in progress lives in full in
> `docs/plans/ACTIVE_PLAN.md`; session start re-injects it until its `Status:` reads `done`.

## Current Focus

Not kicked off yet: run `/kickoff "<Client Name>" <slug>`.

## Decisions
- 2026-11-09: review fixes: the reviewer guard drops sed and rejects a lone `&`; `.env.*` is gitignored; `/kickoff` sets PUBLIC_SITE_URL when given a live URL.
- 2026-11-09: tool rules: project settings declare ponytail/claude-mem/last30days; plan approval injects "execute under ponytail, track in work_state"; research starts with last30days; `/kickoff` warns on missing tools.

## What's Next
