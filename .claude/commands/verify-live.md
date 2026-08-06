# /verify-live — Live Site Browser Test Command
#
# HOW TO USE:
#   /verify-live https://yourclientsite.com
#
# WHAT HAPPENS:
#   Uses Playwright MCP to open a real browser and test the live site
#   Not a code check — this tests what the USER actually sees and clicks
#   Catches issues that only appear in the rendered browser (not in source code)
#
# DIFFERENCE FROM /audit:
#   /audit    → reads your source code files (before deployment)
#   /verify-live → opens a real browser on the live URL (after deployment)
#   You need both. Code can be clean but render broken.
#
# REQUIRES:
#   Playwright MCP server must be running (Commit 5 sets this up)
#   A live URL — not localhost

Use Playwright MCP to open a real browser and test this live URL: $ARGUMENTS

Run every test below in order. Do not skip any.

## TEST 1 — PAGE LOADS
Open $ARGUMENTS in a browser.
Confirm the page loads without a white screen, 404, or error message.
Take a screenshot and describe what you see.

## TEST 2 — MOBILE LAYOUT
Resize the browser to 390px wide (iPhone 14 size).
Confirm:
- No content is cut off or overflowing horizontally
- Text is readable without zooming
- Buttons are large enough to tap (minimum 44px height)
- Navigation is usable on mobile

## TEST 3 — WHATSAPP / CONTACT PATH
Note: not every project has a floating WhatsApp button — check this project's own CLAUDE.md/config before assuming one should exist. If one exists, confirm:
- It is visible on the page and when scrolled (if it should be floating)
- If `market === "KE"` in src/config/site.js, the link starts with `https://wa.me/254`
- Clicking it does not throw a browser error
If no WhatsApp button exists by design, mark this N/A rather than a failure.

## TEST 4 — PRIMARY LEAD-CAPTURE FORM
Find the primary lead-capture form on the site (whatever it's called for this project — check this project's own pages/CLAUDE.md for its actual name and field list, don't assume it matches a prior client's fields) and test it:
- Fill in each visible required field with plausible test data
- Submit the form
- Confirm the page redirects to the expected URL (must be an absolute https:// redirect, not relative)
- Confirm no browser console errors appear during submission

## TEST 5 — IMAGES
Scroll through the full page.
Confirm:
- Hero image loads (no broken image icon)
- No images show a watermark overlay
- Images are not stretched or distorted on mobile

## TEST 6 — PAGE SPEED CHECK
Note the approximate load time when the page first opened.
If it took more than 3 seconds on a simulated mobile connection, flag it.
Recommend running https://pagespeed.web.dev for a full Lighthouse score.

## FINAL REPORT FORMAT:
Return a table with two columns: TEST and STATUS
Status must be: ✅ PASS or ❌ FAIL [description of what broke]
End with: LIVE SITE — READY or NEEDS FIXES ([X] issues found)

Rule: Do not edit any code. Browser testing only.
