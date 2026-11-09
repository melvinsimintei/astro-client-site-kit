# /audit — Full Project Health Check Command
#
# HOW TO USE:
#   /audit
#
# WHAT HAPPENS:
#   Runs a full inspection of the project without changing anything
#   Checks every layer: build, content, forms, SEO, design, accessibility
#   Returns a pass/fail report with exact file and line for every issue
#
# WHEN TO RUN IT:
#   Before shipping a site to a client
#   After making several changes across multiple files
#   When something feels off but you can't pinpoint it

Run a full project audit. Check every item below and return a report.

## 1. BUILD CHECK
Run 'npm run build' and confirm it completes with zero errors.
If it fails, show the exact error message and which file caused it.

## 2. PLACEHOLDER AND KIT-LEAK CHECK
Search src/, public/ (llms.txt, robots.txt), README.md, CLAUDE.md, package.json and
docs/plans/ for leftovers
from the starter kit that must never reach a client repo:
- `[CLIENT`, `[PLACEHOLDER`, `[SLUG`, `[SITE_URL`, `[PHONE`, `[ADDRESS`
- `astro-client-site-kit` anywhere (README.md and package.json `name` especially:
  run /kickoff if found). docs/KIT.md must not exist in a client repo.
- TODO / FIXME
Report every file and line where one was found.

Other-client leak: every name in `~/.claude/client-names.txt` except this client's own
must have zero hits:
`grep -viF "<this client's name>" ~/.claude/client-names.txt > "$TMP/others.txt"` (scratchpad),
then `grep -rniwFf "$TMP/others.txt" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude=.env* .`
Any hit is a BLOCKER. If the list file is missing, report SKIPPED (not PASS).

## 2b. SINGLE-SOURCE NAP CHECK
The clinic's phone, WhatsApp number, address and hours live in ONE file under
src/config/. Grep src/ for the real phone digits, the street/building name and
any hours string (e.g. "8am", "08:00"). Any hit outside src/config/ is a
BLOCKER. There must be exactly one WhatsApp number sitewide.

## 3. FORM CHECK
Find the primary lead-capture form and verify:
- The form provider's access key / equivalent credential is read from an
  env var (e.g. `import.meta.env.WEB3FORMS_ACCESS_KEY`), never hardcoded
  as a literal value in the source file
- Redirect URL is absolute (starts with https://) not relative (/thank-you)
- If `market === "KE"` in src/config/site.js: phone field uses
  pattern="[0-9]{10}" not "\d{10}" (Safari fix) — if market is not "KE",
  mark this N/A rather than failing
- All required fields have the 'required' attribute

## 4. WHATSAPP CHECK
Find all WhatsApp links, if any exist.
If none exist by design, mark this N/A — do not fail a project for not having one.
If any exist, verify:
- If `market === "KE"`: format is wa.me/254XXXXXXXXX (not wa.me/0XXXXXXXXX), phone
  number is 12 digits including country code 254 — if market is not "KE", confirm
  the format matches whatever this client's actual country/market requires instead
- Link opens in a new tab (target="_blank")

## 5. SEO CHECK
Read src/layouts/Layout.astro or equivalent and verify:
- <title> tag exists and is not a placeholder
- meta description exists and is not a placeholder
- og:title exists
- og:description exists
- og:image exists and points to a real file in public/

## 6. IMAGE CHECK
List all images in public/ and verify:
- Every <img> tag in src/ has a non-empty alt attribute
- No images are still watermarked stock photos (check filename for 'getty', 'shutterstock', 'watermark')
- Hero image exists and is referenced correctly

## 7. DESIGN TOKEN CHECK
Read the project's token file (named in CLAUDE.md, e.g. src/styles/tokens.css) and verify:
- A token layer exists (a `:root` block of colour/font/spacing custom
  properties) and components actually use it via `var(--...)`
- Spot-check components: no hardcoded hex values or font names outside the
  token file itself
- Confirm the radius/shadow/motion values were deliberately chosen in this
  project's own design-system doc (see CLAUDE.md), not left at defaults
- Font is loaded via a <link>/self-hosted import, not a runtime Google Fonts
  `@import` in CSS (faster loading)

## 8. DESIGN HOMOGENIZATION CHECK
Search src/ for code, class names or colours copied from another client repo
in ../ (any sibling under client-projects/). Every site is written from
scratch. Any copied component or palette is a BLOCKER.

## 9. ACCESSIBILITY CHECK
Scan all components and verify:
- Every interactive element has an aria-label or visible text
- Images have alt text (caught in image check above)
- A <main> landmark element exists in the layout
- Screen-reader-only class (sr-only) is defined in the project's stylesheet (see CLAUDE.md Design system)

## 10. DIST AND LAUNCH CHECK
After the build, grep dist/ (case-insensitive) for: demo, lorem, sample,
24/7, pain-free, and any banned word listed in CLAUDE.md. Zero hits.
Also verify: every phone is a `tel:` link, the viewport meta never locks
zoom, the copyright year is dynamic, and Book is reachable from every page.

## 11. HOOKS CHECK
Run `npm test` (includes .claude/hooks/pre-tool-use.test.mjs). It must pass:
the push block and commit-ask are the repo's safety net.

## 12. README CHECK
README.md must describe THIS client's site, not the kit. FAIL if it contains
"astro-client-site-kit" or any `[CLIENT` blank: run /kickoff.

## FINAL REPORT FORMAT:
Return a table with two columns: CHECK and STATUS
Status must be: ✅ PASS or ❌ FAIL [file:line]
End with: OVERALL — READY TO SHIP or NEEDS FIXES ([X] issues found)

Rule: Read only. No code changes. No npm install beyond the build check.
