# Student wellbeing frontend

Staff-operated React/Vite interface for the mental-health screening support demo. The browser calls the FastAPI backend; it does not load the ML models or connect to PostgreSQL.

## Run locally

```powershell
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Vite uses a fixed port and reports a conflict instead of silently changing it. The backend defaults to http://127.0.0.1:8000; set VITE_API_BASE_URL in a frontend .env if it changes. No database password belongs in frontend configuration.

Keep Docker/PostgreSQL, FastAPI and the trained ML inference service running. Sessions survive a refresh in the same tab and remain subject to backend expiry and revocation.

## Normal workflow

1. Screening personnel register/select a student, record heart rate and collect five demo-scale answers: sleep duration, screen time, assignment load, exam pressure and social support.
2. Submit screening and run prediction saves the inputs and requests the models automatically. Save draft only keeps the case private to screening staff and does not run inference.
3. All counsellors see submitted cases and separate stress/anxiety categories on the dashboard, including Low-category results.
4. A counsellor opens an unclaimed case and chooses Take case and begin counselling. This makes that counsellor responsible and starts review in one action. Two counsellors cannot take the same case.
5. The responsible counsellor verifies the original answers, assesses the student and records counselling, referrals or follow-ups. Confidential answers/notes stay restricted to the appropriate staff.

Administrator assignment is not a required step. Administrators manage staff and operational reports and can transfer an already-owned case when necessary. Existing case ownership and history are preserved.

Student/course/counsellor names are displayed instead of internal UUIDs. The university is taken from configuration or the single university already on file; the first registration asks for it only if it cannot yet be determined. Course and year remain student context; the selected baseline models do not use them to predict.

## Dashboard and reliability

The case queue refreshes every 30 seconds while visible and on focus, with a manual refresh option. Charts use seven days of role-scoped aggregate counts from the backend, labeled as UTC dates. The frontend does not download all screening histories to draw the chart.

If inference is unavailable or outside demo model support, submission remains saved and visible with a pending-retry status. Retrying a successful prediction reuses its saved result. Categories represent the simulated dataset, not a diagnosis or a validated clinical screening result.

Staff invitations currently require private delivery of an activation code; email delivery is not configured. Localhost addresses work only on the computer running the system. Access from other computers needs separate hosting/network configuration.

## Checks

```powershell
npm run lint
npm run build
```

If the development environment blocks Vite's configuration-bundling subprocess, the equivalent native-loader build is:

```powershell
node node_modules/vite/bin/vite.js build --configLoader native
```

The lockfile, Vite/lint configurations and public assets are intentionally tracked by Git. Obsolete demo data and unused demo components have been removed; application data comes from the backend.
