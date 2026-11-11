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

## Bank

The company fund from the partners agreement: each partner pays 25% of what they earn from OneZeroLabs work into the company bank within 7 days, and every payment out needs both partners to agree. This page is the shared record the agreement asks for.

- **Add earning:** who earned it, how much (GST left out), when, and for which client. The 25% is worked out as it is typed and kept with the earning, so a later change of rate never rewrites the past.
- **Paid in:** on by default, so the share joins the balance straight away. Turned off, the share waits under "To pay into the bank" with its due date, turns red once late, and has a Paid button.
- **Money in and out:** anything else, such as the opening balance or spending. Money out needs the "both of us agreed" switch, and the database refuses spending without it.
- **Balance:** shares paid in, plus money in, minus money out. It is a record kept by hand, so check it against the bank statement now and then, and use Money in or Money out to correct any difference.

## Goals

Daily, weekly, monthly and yearly goals, for one founder or both together. Open it from the sidebar or the Overview card.

- **Periods:** a week runs Monday to Sunday, a month from the 1st, a year from 1 January. The arrows move between periods and keep each one's result.
- **Repeat:** a repeating goal comes back every period, starting afresh at 0. Stopping it removes it from the period you are looking at onwards, and earlier results are kept.
- **Targets:** "20 calls" counts up with + and −. A big target, such as ₹1,00,000, is typed in from the goal's sheet. A goal without a target is ticked.

## Events

Events the founders attend, with photos and notes. Open it from the sidebar or the Overview card.

- **Photos:** made smaller on the phone before upload, to 2048 px and a 480 px copy for lists, both JPEG and turned the right way up. A phone photo goes up as roughly 200 KB. They are stored in the database, like Documents, so they count towards Neon's 0.5 GB.
- **Viewing:** tap a photo for full screen; swipe, arrows or the arrow keys move along. `/events/photo/[id]` checks the session itself.

## Profile photos

Each founder can add their own photo in Profile: tap the circle or "Choose photo". The phone crops it to a square from the middle and shrinks it to 512 px, about 30–60 KB, before upload. It replaces the initial in the sidebar, on Profile and on event posts, for both founders. Nobody can set the other founder's photo. It is served from `/profile/photo/[id]?v=…`, which checks the session; the `v` is when it last changed, so a new photo shows at once.

## Notifications and the Android app

- **What notifies:** when one founder gives the other a task, or adds a task for both, the other one is told. A task whose name says meeting, meet, catch-up, demo, interview or visit (or "call" when it is for both) reads as a meeting. Your own tasks never notify you, and editing a task you already had doesn't notify you again. The bell (phone) and Notifications (sidebar) list them.
- **Reminders:** at the task's time, or 9 am on its date if it has no time. They go to whoever the task is assigned to, both founders for a shared task, or whoever added an unassigned one. Only the Android app shows reminders.
- **The Android app** (`android/`) is the website in a native shell. Alarms on the phone fire the reminders at the exact minute, even without signal. Every 15 minutes it checks for new notices in the background, and after a restart it sets its alarms again. It talks to the server through `/api/app/reminders`, `/api/app/inbox` and `/api/app/devices`, signed in with the same cookie as the website.
- **Build it:** in `android/`, with Android Studio's Java, run `.\gradlew assembleRelease` (or open the folder in Android Studio). The APK is `android/app/build/outputs/apk/release/app-release.apk`. A debug build installs beside it as "OZL OS Test" and talks to `http://10.0.2.2:3200` (pass `-PozlTestUrl=` for another address).
- **Signing key:** `android/keystore/` and `android/keystore.properties`, kept out of git. Back them up. Without the same key, a new version can't install over the old one; you'd have to uninstall first and sign in again.
- **Push (instant notices):** off until Firebase is set up. Until then the app's 15-minute check delivers notices. To turn it on:
  1. Create a Firebase project and add an Android app with package name `in.onezerolabs.os`.
  2. Download `google-services.json` into `android/app/` and rebuild the app.
  3. In Firebase, Project settings → Service accounts → Generate new private key.
  4. Put that file's contents in the Vercel environment variable `FCM_SERVICE_ACCOUNT` (Production, as a Secret), and redeploy.

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

Everything lives in this one app. Built so far: overview, CRM and lead pipeline, projects, tasks with times, voice task capture, documents in folders, bank and the 25% fund, profile, light and dark modes, revenue, invoices with PDF, and a change log for money records.

Next, in priority order: founder command centre and daily check-in, goals and OKRs, business development and cold-call tracking, permissions and audit logs across the app, SOP library, team workspace, Google Calendar and reminders. After those: quotations, client support, product lab, client portal, asset registry, business intelligence, AI assistant, search and quick actions, knowledge centre.
