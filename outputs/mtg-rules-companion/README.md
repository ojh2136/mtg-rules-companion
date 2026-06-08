# Stackwise

Stackwise is now a focused Magic: The Gathering ruling archive.

The app is not trying to fully simulate every Magic interaction. Instead, it stores clear ruling questions and answers so real play questions can become a searchable personal reference library.

## What It Does

- Save ruling questions and answers.
- Search saved rulings by card name, rule topic, or answer text.
- Add tags such as card names, formats, or rules concepts.
- Copy a saved ruling for sharing.
- Export the archive as JSON.
- Keep saved rulings in the browser's local storage.

The first seeded ruling is:

- `Sheoldred, the Apocalypse` plus `Brainstorm`
- Brainstorm draws three cards, so Sheoldred triggers three times and you gain 6 life total.

## Local Use

From this folder:

```bash
npm install
npm start
```

Then open:

```text
http://127.0.0.1:4177/
```

The app can also be opened as plain static files because the archive is stored in browser local storage.

## Publishing

The current published site is:

```text
https://mtg-rules-companion.onrender.com/
```

For this archive-only version, a backend database is optional. The simplest deployment is just static hosting, because saved rulings live in each user's browser.

Recommended cheap setup:

- Render, Cloudflare Pages, Netlify, or Vercel for the static site.
- No database required for personal use.
- Add a database later only if users need account-based syncing across devices.

## Workflow

1. Ask a Magic ruling question in Codex/ChatGPT.
2. Copy the final answer.
3. Open Stackwise.
4. Save the question, answer, and tags.
5. Search the archive later during games.

When a new ruling is answered in this thread, Codex can update the app by adding that ruling to the seeded archive or by helping paste it into the app.

## Important Note

Stackwise is an unofficial educational reference. For tournament authority, verify with the current Magic Comprehensive Rules, Magic Tournament Rules, Infraction Procedure Guide, and official Oracle card text.
