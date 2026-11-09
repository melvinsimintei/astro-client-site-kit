---
description: Run the code-reviewer agent on uncommitted changes (optionally focused on a file)
argument-hint: "[file]"
---

Use the code-reviewer agent to review: $ARGUMENTS (all uncommitted changes if empty).

The reviewer must:
1. Run `git status --short` and `git diff HEAD` to see every change since the last commit,
   including untracked files. If $ARGUMENTS names a file, review it first.
2. Run `npm run build`, `npx astro check` and `npm test`. Warnings count. If the shell is
   unavailable, say so explicitly; never imply the build passed.
3. Check against CLAUDE.md (rules, QA gate, banned words) and the project's design-system doc
   (run its review greps): mobile-first, Astro Image for raster images, form key from an env var
   (never hardcoded), phone pattern `[0-9]{10}`, WhatsApp as `wa.me/254…`, NAP/hours only from the
   one config file in `src/config/`, no fabricated people/reviews/counts, every fill item logged.
4. If `docs/plans/ACTIVE_PLAN.md` covers this work, compare plan vs build phase by phase.
5. Return **APPROVED** or **NEEDS CHANGES**, every finding with `file:line` and a severity.
6. Remind the user to update the `docs/plans/STATUS.md` narrative if the pass completes work.

Best run in a fresh session (`/clear` first): no memory of why choices were made.
Read and judge only. No edits, no installs, no git mutations.
