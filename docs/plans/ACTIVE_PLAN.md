<!-- Written by .claude/hooks/plan-capture.js on plan approval. Set the Status line to `done` when the plan is finished. -->
Status: done
Approved: 2026-11-09T02:58:14.193Z

# Fix the 9 review findings on the kit's clean-start pass

Status: approved

## Context
The `/review` run gave NEEDS CHANGES: 2 major (the read-only guard on the code-reviewer can be bypassed), 4 minor, 3 nits.
The owner wants every finding fixed before committing and pushing manually. No commit, no push.

## Phase 1: Reviewer guard (`.claude/hooks/pre-tool-use.js`): findings 1 and 2
- **The lone `&` bypass:** in `isReviewerSafe`, after `stripped` is built (`2>&1` is already removed by then), add
  `if (/(^|[^&])&(?!&)/.test(stripped)) return false;`
  This blocks a background `&` and PowerShell's `&` call operator, and still allows `&&`.
- **sed:** remove sed from the reviewer entirely. `head`, `tail` and Read already cover reading lines.
  - Drop `sed\s+-n` from the `REVIEWER_ALLOWED` regex (line 58).
  - Delete the sed denylist block (lines 68-71).
  - An allowlist beats patching the denylist one form at a time.
- Update the header comment (lines 11-12) and the block message (line 143) if they name sed. They don't today, so check only.

## Phase 2: Tests (`.claude/hooks/pre-tool-use.test.mjs`)
- Line 48, `sed -n '1,200p'`: the expected result changes from allow to BLOCK.
- New BLOCK cases for the reviewer:
  - `ls & npm install x`
  - `ls&node -e x`
  - `& node -e x`
  - `sed -n '1,5w out' f`
  - `sed -n '1e cmd' f`
  - `sed -n 's/x/y/e' f`
  - `sed -n -Ei 's/a/b/' f`
- A new allow case for the reviewer: `npm test && git status`.
- The `npm run build 2>&1 | tail -20` case (line 46) stays allow. It proves the `&` check ignores `>&N`.

## Phase 3: Minor fixes
- **Finding 3, `.claude/hooks/sync-status.js:51`:** compare after normalising line endings.
  Add `const norm = (s) => s.replace(/\r\n/g, "\n").trim();` and use it on both sides of the comparison.
  The reviewer gave line 249; the real line is 51.
- **Finding 4, `.gitignore:15-18`:** replace the three `.env` lines with `.env`, `.env.*` and `!.env.example`.
- **Finding 5, `.claude/commands/kickoff.md` step 9:** "copy `.env.example` to `.env`; if a live URL was given, set `PUBLIC_SITE_URL=<url>/` in `.env` (edit that one line, never print the file) and tell the owner to set the same variable on the host".
  This matches step 7's `Sitemap:` line, so robots.txt no longer points at a sitemap that is never built.
- **Finding 6, `astro.config.mjs:6-7`: the code is correct, so only the comment changes.**
  - Checked in `node_modules/astro/dist/core/dev/dev.js:24`: `astro dev` calls `ensureProcessNodeEnv("development")` before it loads the config.
  - So the dev server reads `.env.development`, and the reviewer's concern doesn't apply.
  - Extend the comment: "astro dev/build set NODE_ENV before loading this file; the fallback covers bare tooling."

## Phase 4: Nits
- **Finding 7, `README.md:4`:** no change. "The Preferred Clinic System" is the owner's own agency brand (their dental-clinic skills use it), not a client.
- **Finding 8, `.claude/commands/verify-live.md:17`:** change "(Commit 5 sets this up)" to "(registered once at user scope, see docs/KIT.md)".
- **Finding 9, `.claude/hooks/session-start.js`:** add the missing space at line 112 (`status.trim(), narrativeShare`) and remove one of the two blank lines at 61-62.

## Phase 5: Verify and wrap up
- Run `npm test`. It must pass with 51 − 0 + 8 = 59 cases, every one passing.
- Run `npm run build` and `npx astro check`: 0 errors, 0 warnings, 0 hints.
- Run a manual hook check: `echo '{"hook_event_name":"Stop"}' | node .claude/hooks/sync-status.js`. With uncommitted changes and an untouched CRLF STATUS.md, it should now print the reminder.
- `git check-ignore .env.development .env.staging` should print both paths; `git check-ignore .env.example` should print nothing.
- Add one line to `docs/plans/STATUS.md` Decisions: "2026-11-09: review fixes: reviewer guard drops sed and rejects a lone `&`; `.env.*` ignored; kickoff sets PUBLIC_SITE_URL."
- Set this plan's `Status:` to done. Recommend `/review`, focused on the `pre-tool-use.js` guard. No commit; the owner commits and pushes.
