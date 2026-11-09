---
description: Turn a fresh copy of the kit into this client's repo (README, CLAUDE.md, config, package name, STATUS)
argument-hint: "\"<Client Name>\" <slug> [live-url]"
---

Kick off a new client project: $ARGUMENTS

Parse the client name (quoted), the slug (kebab-case, used for package.json and the repo) and an
optional live URL. If the name or slug is missing, ask once, then continue.

The rule: a client repo starts with the kit's tools and nothing else. No kit history, no kit plans,
no notes from other repos.

1. **Guards.** Stop and tell the owner what to fix if any of these hold:
   - `package.json` `name` is not `astro-client-site-kit`: already kicked off.
   - The kit's history came along: `git remote get-url origin` contains `astro-client-site-kit`,
     or `git log --oneline` shows more than one commit (a "Use this template" repo has one).
     Start from GitHub "Use this template", or delete `.git` and run `git init` (see docs/KIT.md).
   - `.claude/agent-memory/`, `.claude/settings.local.json` or `.env` exist: the kit folder was
     copied, not cloned, and carries this machine's notes and keys from other repos. The owner
     deletes them, then re-runs `/kickoff`. (Check existence only; never read `.env`.)
   **Tool check (warn, never stop):** in `~/.claude/settings.json` `enabledPlugins`, look for
   `ponytail@ponytail`, `claude-mem@thedotmack` and `last30days@last30days-skill` set to true, and
   check that `~/.claude/skills/graphify/` exists. List anything missing with its install line from
   docs/KIT.md "Machine setup" (read it before step 8 deletes it).
2. **README.md:** it is the client template. Replace every `[CLIENT NAME]`, `[SLUG]` and `[SITE_URL]`
   (leave `[SITE_URL]` as "not live yet" if no URL was given). Delete the template's HTML comment.
3. **CLAUDE.md:** replace `[CLIENT NAME]` in the title and Status. Leave the other `[PLACEHOLDER]`
   blocks: they are filled from research, never guessed. List them for the user.
4. **src/config/site.js:** set `name` to the client name. Leave every other field empty: they are
   verified facts, filled during research.
5. **package.json:** set `name` to the slug. Run `npm install` only if `node_modules/` is missing.
6. **docs/plans/:** in STATUS.md set the title to "<Client Name> website — Live Status" and the
   Current Focus to "<today>: kicked off from the starter kit." Make sure ACTIVE_PLAN.md is the
   "No active plan / Status: done" stub.
7. **public/:** in `robots.txt`, set the `Sitemap:` URL if a URL was given, otherwise delete that
   line. In `llms.txt`, set the `# [CLIENT NAME]` title; leave the other placeholders for after
   research (list them).
8. **docs/KIT.md:** delete it. It documents the kit, not this client.
9. **.env:** copy `.env.example` to `.env` (never print its contents). If a live URL was given, set
   the `PUBLIC_SITE_URL=` line to `<url>/` (edit that one line only) so the sitemap that step 7's
   robots.txt points at is actually built, and tell the owner to set the same variable on the host.
10. **Client-names list:** append the client name to `~/.claude/client-names.txt` (create it if
    missing), so other repos' audits catch it if it ever leaks.
11. **claude-mem:** `work_state_write` list "<slug>-phases" with one todo per phase in CLAUDE.md's
    Model routing table.
12. **Check:** zero hits required for `astro-client-site-kit` and `[CLIENT` in README.md, the
    CLAUDE.md title/Status, package.json, `src/config/site.js`, `public/llms.txt` line 1 and
    docs/plans/. Then run the other-client leak grep from `/audit` §2.
13. Print: what changed, the open CLAUDE.md placeholders, and the next step:
    "Research pass on Opus: fill the Clinic configuration from verified sources."

Do not commit. Recommend: `Kick off <Client Name> from astro-client-site-kit` as the first commit.
