# Known Issues

Tracks issues found across client projects built from this starter. Add project-specific
entries as they come up; the sections below are seeded from prior client work and apply
to every new client project until proven otherwise.

## Safari iOS Bugs (Apply to Every Client Project)

### BUG - Phone Regex Pattern Breaks on Safari iOS before 16.4
Problem:  pattern="\d{10}" causes silent validation failure on Safari
          The form appears to submit but validation is broken
Fix:      Always use pattern="[0-9]{10}" instead
          Never use \d in HTML pattern attributes

### BUG - Web3Forms Relative Redirect URL
Problem:  redirect="/thank-you" silently fails
          Form submits but user never sees confirmation
Fix:      Always use absolute URL: redirect="https://yourclientsite.com/thank-you"

### BUG - WhatsApp Link Wrong Format
Problem:  wa.me/0712345678 does not work outside Kenya
Fix:      Always use wa.me/254712345678 (country code, no leading zero)
          Only applies if the client's market config is "KE" — see src/config/site.js

---

## Windows Git Bash Gotchas

### BUG - cp -r skips hidden folders
Problem:  cp -r source/ destination/ skips .claude/ .github/ .mcp.json
Fix:      Always use cp -r source/. destination/ (note the dot after source/)

### BUG - /tmp does not exist on Windows
Problem:  Scripts that write to /tmp/ fail on Windows Git Bash
Fix:      Write temp files to the project root or use os.tmpdir() in Node.js

### BUG - require() breaks in Astro projects
Problem:  Astro sets "type": "module" in package.json
          This makes Node.js treat all .js files as ES modules
          require() is CommonJS syntax and crashes in ES module scope
Fix:      Never use require() in hook files inside an Astro project
          process and console are globals - no import needed
