<!-- Client README template. /kickoff fills the [BLANKS] and deletes this comment; /audit fails while any remain. -->
# [CLIENT NAME] — website

The website for [CLIENT NAME], built by The Preferred Clinic System.

- **Live:** [SITE_URL]
- **Repo:** `[SLUG]`
- **Current state:** `docs/plans/STATUS.md` (start here)

## Run it

```bash
npm install
cp .env.example .env    # add the Web3Forms key; PUBLIC_LAUNCH=true only when the site may be indexed
npm run dev             # http://localhost:4321
npm run build           # static output in dist/
npm test                # hook tests
```

## Where things are

- `CLAUDE.md`: the rules for this project (facts, design, voice, QA gate).
- `src/config/`: the one source for name, phone, WhatsApp, address and hours.
- `docs/plans/`: STATUS (current state) and the active plan.
- `docs/research/`: verified facts and research, once the research pass runs.

## Stack

Astro (static) · plain CSS tokens · self-hosted fonts · Web3Forms · Netlify.
