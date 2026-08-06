# MEMORY.md — Paste These at the Start of Every New Client Project

## HOW TO USE THIS FILE
Open Claude Code in the new client project folder.
Paste each #memory entry below one at a time.
Claude Code will confirm each one was saved.
Do this before typing a single instruction.

---

## CORE WORKFLOW RULES

#memory Never run git add, commit, or push without explicit human approval.
Always show a diff summary and wait for the word "approved" before committing.

#memory Always explore before fixing. Never guess at a bug fix without first
reading the relevant files and build output. Run /explore before touching code.

#memory One issue per commit. Never bundle unrelated fixes into the same commit.
If the diff contains unrelated changes, warn the human before committing.

#memory Review in a fresh session. Never review code in the same session that
wrote it. Bias makes the review useless. Open a new Claude Code session for /review.

---

## AGENT RULES

#memory The codebase-explorer agent is read-only. It must never edit, create,
or delete files. It reads and summarizes only.

#memory The code-reviewer agent must never install packages or run npm install.
It reviews code by reading files and running git diff only.
It returns a PASS or FAIL verdict with exact file and line numbers.

---

## KENYAN MOBILE RULES

#memory For Kenyan phone validation, use [0-9] not \d in HTML pattern attributes.
\d breaks on Safari iOS before version 16.4. Always use pattern="[0-9]{10}".

#memory WhatsApp links must use the format wa.me/254XXXXXXXXX.
Never use wa.me/0XXXXXXXXX (leading zero does not work outside Kenya).

#memory Web3Forms redirect URL must be absolute (https://yourclientsite.com/thank-you).
A relative URL (/thank-you) silently fails — the form submits but user sees nothing.

---

## WINDOWS GIT BASH RULES

#memory On Windows Git Bash, cp -r source/ destination/ skips hidden folders
like .claude/ and .github/. Always use cp -r source/. destination/ with a dot.

#memory On Windows, /tmp does not exist. Write temp files to the project root
or use os.tmpdir() in Node.js scripts instead of hardcoded /tmp paths.

#memory Astro projects set "type": "module" in package.json. This means all
.js files are ES modules. Never use require() in hook files. process and
console are globals — no import needed.

---

## GIT SAFETY RULES

#memory Never run git push automatically. Push is always a manual step
performed by the human after /review returns a PASS verdict.

#memory Never run rm -rf. If files need to be deleted, the human does it
manually. There is no recycle bin — deletion is permanent.

---

## PLAYWRIGHT RULES

#memory /verify-live tests the live deployed URL, not local code.
Run /audit first (checks source code), then deploy, then run /verify-live.
Both checks are needed — they catch different types of failures.

#memory Playwright session output (.playwright-mcp/ folder) is gitignored.
Screenshots and logs are generated fresh on every /verify-live run.
Never commit the .playwright-mcp/ folder.
