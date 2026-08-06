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

## 2. PLACEHOLDER CHECK
Search all files in src/ (and src/config/site.js, src/styles/global.css specifically)
for any remaining placeholder text or the sentinel design-token values that ship
by default in this starter and must never reach a live client site:
- [PLACEHOLDER]
- [CLIENT NAME]
- [PHONE]
- [EMAIL]
- [ADDRESS]
- [SITE_URL]
- #ff00ff / #FF00FF (the starter's deliberately-fake default color token value)
- TODO
- FIXME
Report every file and line where one was found.

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
Read the global CSS token file (src/styles/global.css) and verify:
- A token layer exists (a `:root` block defining color/font/spacing custom
  properties) — do NOT check for an exact count of color variables, a
  richer or simpler token system than this starter's default is fine, the
  point is that a token layer exists and is actually used
- No `#ff00ff` sentinel placeholder values remain anywhere in the file (see
  PLACEHOLDER CHECK above — this is the same check, called out again here
  because it's easy to miss if only src/ is scanned and not src/styles/)
- Spot-check a handful of components: colors and fonts are referenced via
  `var(--...)` tokens, not hardcoded hex values or font names outside the
  token file itself
- Confirm the radius/shadow/motion values in the token file were
  deliberately reconsidered against this client's own Design Philosophy
  answer in docs/CLIENT_INTAKE_TEMPLATE.md, not left at the starter's
  neutral defaults — "the color tokens were changed" is not sufficient on
  its own to pass this check, the shape (flat vs. depth, sharp vs. rounded)
  needs a deliberate answer too
- Font is loaded via a <link>/self-hosted import, not a runtime Google Fonts
  `@import` in CSS (faster loading)

## 8. DESIGN HOMOGENIZATION CHECK
Search src/ for any import of a file under docs/patterns/. There should be
none — everything in docs/patterns/ is a reference example, never meant to
be wired into the live build. If one is found, flag it as a BLOCKER: it
means a starter-kit example (built for a different, prior client) shipped
on this client's site instead of a fresh implementation.

## 9. ACCESSIBILITY CHECK
Scan all components and verify:
- Every interactive element has an aria-label or visible text
- Images have alt text (caught in image check above)
- A <main> landmark element exists in the layout
- Screen-reader-only class (sr-only) is defined in global CSS

## FINAL REPORT FORMAT:
Return a table with two columns: CHECK and STATUS
Status must be: ✅ PASS or ❌ FAIL [file:line]
End with: OVERALL — READY TO SHIP or NEEDS FIXES ([X] issues found)

Rule: Read only. No code changes. No npm install beyond the build check.
