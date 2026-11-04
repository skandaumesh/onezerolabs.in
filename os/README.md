# OneZeroLabs OS

Private workspace for the OneZeroLabs co-founders: an overview dashboard, client CRM with a lead pipeline, projects and tasks. It is a separate app from the public site in the parent folder and shares none of its pages, navigation or analytics.

**This repository is public. Real client data must only ever live in the database, never in code or in git.**

## Run it on this computer

```bash
cd os
npm install
cp .env.example .env.local      # then set SESSION_SECRET (the file explains how)
npm run user:add -- --name Skanda --email you@example.com
npm run dev                     # http://localhost:3100
```

Run `user:add` once for each founder. Running it again for an existing email resets that password.

In PowerShell, npm drops the `--`, so the name and email never reach the script. Run it directly instead:

```powershell
node --env-file=.env.local scripts/add-user.mjs --name Skanda --email you@example.com
```

With `DATABASE_URL` set, as `neon init` does, the app uses that Postgres database. With no `DATABASE_URL`, data is stored in `os/.data/` on this computer only. In that case back the folder up, and stop the dev server before running `user:add`, because the local database allows one process at a time.

## Deploy it so both founders share it

The database is on Neon, linked through `.neon` and `neon.ts`. Its connection string is in `.env.local`, which git ignores.

1. Create a new site on your host, separate from the public site, with `os` as the base directory. Host it in Singapore, next to the database.
2. Set `DATABASE_URL` and `SESSION_SECRET` on that site, using the values in `.env.local`.
3. Run `user:add` from this computer, once per founder.
4. Give it its own subdomain, such as `os.onezerolabs.in`.

Tables are created automatically on first connection.

## Tests

```bash
npm test
```

Covers sessions, passwords, IST date handling, the database rules, and how spoken sentences are read.

## Adding a task by voice

The mic button on every screen opens a sheet that starts listening. Say the task in one sentence, such as "I have meeting today at 7", and it is saved as Meeting, today, 7:00 pm. Undo is shown straight away in case it misheard. Typing the same sentence does the same thing.

- **Understanding:** `lib/parse-task.mjs` reads the sentence with plain rules, so it costs nothing and needs no API key. It runs in the browser for the live preview and on the server when saving.
- **What it picks up:** the task name, date, time, priority ("urgent"), repeats ("every Monday") and who it is for ("tell Tanisha to...", or both of you with "we have...", "for both of us" or both names).
- **A bare hour:** with no am or pm, 8 to 11 is morning and 12 to 7 is afternoon or evening. For something today, a time already gone flips to the other half of the day.
- **Hearing:** the browser's speech recognition does this. It needs a secure page (HTTPS or `localhost`), so voice is unavailable on a plain `http://` Wi-Fi address and the sheet offers typing instead. In Chrome the audio goes to Google to be transcribed, so client names said aloud go there too.

## Documents

Agreements, quotations and other files, in folders that nest like the Files app. Open it from the sidebar, the Overview card, or a client's page, which lists the files linked to that client.

- **Where files live:** in the database itself (`document_files`), so they are backed up and kept private with everything else, with no separate storage to set up. Neon's free plan holds 0.5 GB in all. The Documents page shows how much is used.
- **What can go in:** PDF, Word, Excel, PowerPoint, text, CSV, images and zip, up to 4 MB each, because Vercel refuses any request over 4.5 MB. The type comes from the name and must match the file's contents, so a renamed program is refused. Web pages, SVGs and programs are never accepted.
- **Looks:** folders and files show as big icons, as in the Files app on iPhone, and a PDF shows its first page.
- **Reading a PDF:** it opens on its own page inside the app on every device, drawn by pdf.js (`lib/pdf-client.js`, `components/PdfViewer.jsx`). Phones can't show a PDF in a page by themselves; Android would hand it to another app. Tap a page for full screen, where pinch, double-tap, the + and − buttons, or the + / − / 0 keys zoom. Only pages near the screen are drawn, so a long agreement doesn't fill a phone's memory. The pdf.js worker is served by the app at `/documents/pdf-worker`, so no document goes to any other site.
- **Other files:** images show on their page. Everything else downloads, so nothing uploaded can run inside the app. `/documents/file/[id]/raw` checks the session itself.
- **Safety:** a folder can only be deleted once it is empty, and uploading the same file twice into a folder is ignored. Every upload, rename, move and delete is in the file's history.

## Design rules

The interface follows Apple's interaction rules on both phone and desktop. New screens should keep to them:

- **Press:** anything tappable uses `.press` or `.row-press`, which react on touch, not on release.
- **Waiting:** a tap never waits for the server to look answered. Ticks are optimistic (`CheckButton`), nav lights up at once, and `loading.jsx` covers navigation.
- **Motion:** springs, with no bounce unless a gesture carried momentum. Animate only `transform` and `opacity`.
- **Sheets:** use `SheetButton` for quick forms. It handles dragging, flicks, interruption, the keyboard and Reduce Motion.
- **Alerts:** never the browser's own `confirm` or `alert`. `ConfirmSubmit` asks before anything that deletes or can't be taken back: an action sheet on phones for destructive choices, a centred alert otherwise. The safe button comes first and takes focus. A form's error opens an alert by itself (`errorTitle` sets its heading), and anything else uses `ProblemAlert`.
- **Banners:** good news that needs no answer goes in the pill at the top: pass `success` to `ActionForm`, or call `showBanner`. Keep it to a few words.
- **Phones:** fields stay at 16px so iOS does not zoom, and targets stay at 44px.
- **Type:** use the size tokens in `tailwind.config.js`, which set tracking and leading for each size.
- **Light and dark:** use the colour tokens, never fixed colours such as `bg-white`. Both sets of values are in `app/globals.css`. Check new screens in both modes.

## How it fits together

| Path | What it is |
|---|---|
| `app/(hub)/` | The signed-in pages |
| `lib/actions/` | Everything that changes data. Each action checks the session itself. |
| `lib/queries.js` | Everything that reads data |
| `lib/migrations.mjs` | The schema. Append a new entry to change it. |
| `lib/db.mjs` | Connects to Postgres, or to the local database |
| `proxy.js` | Sends anyone not signed in to `/login` |

## Roadmap

Everything lives in this one app. Built so far: overview, CRM and lead pipeline, projects, tasks with times, voice task capture, documents in folders, profile, light and dark modes, revenue, invoices with PDF, and a change log for money records.

Next, in priority order: founder command centre and daily check-in, goals and OKRs, business development and cold-call tracking, permissions and audit logs across the app, SOP library, team workspace, Google Calendar and reminders. After those: quotations, client support, product lab, client portal, asset registry, business intelligence, AI assistant, search and quick actions, knowledge centre.
