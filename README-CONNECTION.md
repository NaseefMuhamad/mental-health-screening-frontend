# Frontend and backend connection

The existing frontend project has been updated directly. Previous versions of changed files are in the workspace output folder `frontend-before-connection-20261105-154700`. Your package.json, lockfile, existing .env and backend files were not changed.

## Addresses
- Backend: http://127.0.0.1:8000
- Frontend: http://127.0.0.1:5173
- API documentation: http://127.0.0.1:8000/docs

Vite now uses port 5173 with strictPort, so it stops with a clear error if the port is occupied. Restart your frontend development server after these configuration changes. Run `npm run dev` from the frontend directory and keep the backend terminal running.

The frontend defaults to the backend address above. To change it, set `VITE_API_BASE_URL` in the frontend .env and restart Vite. This is a public server address, never a database password. The backend must allow the exact frontend origin in CORS_ORIGINS.

## Current database blocker
On verification, /health returned 200 and CORS accepted http://127.0.0.1:5173. However /auth/me returned 503 database_unavailable. The backend root .env exists but has no settings. A separate read-only connection check confirmed DB_NAME and DB_USER (or DATABASE_URL) are missing. The project database has not been created yet, according to the user. The frontend connection cannot complete a real login until PostgreSQL and administrator setup are finished.

## Database setup, once PostgreSQL is available
Use your existing PostgreSQL server if you have one. In pgAdmin, connect to that server and create a database named `mental_health_screening`, owned by your database user. Confirm the host, port and username from that server; do not assume these values for a hosted database. For a standard local installation the host is usually localhost and port usually 5432.

Fill in the BACKEND root .env locally, using the actual values for your server:

```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mental_health_screening
DB_USER=YOUR_DATABASE_USER
DB_PASSWORD=YOUR_DATABASE_PASSWORD
CORS_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
```

Keep the password private. Do not paste the .env into chat or commit it. If DATABASE_URL is present, it takes precedence over these separate DB_* values. Preserve other existing application settings.

With the backend virtual environment active and terminal at its project root:

```powershell
python -c "from app.database.connection import check_database_connection; check_database_connection(); print('Database connected')"
python -m app.database.init_db --create-tables
python -m app.auth.bootstrap_admin --email "YOUR_ADMIN_EMAIL" --name "Institution Administrator"
python -m uvicorn app.main:app --reload
```

The administrator setup prompts for a new password privately. It runs once; if an administrator already exists, use that account. Table creation is for the new project database. Existing databases with a differing schema require a migration; do not delete existing tables to resolve a mismatch. Restart the backend after changing .env.

## First complete workflow
1. Sign into the frontend with the administrator email and password created above.
2. Open Staff management, invite screening personnel and a counsellor. Deliver each invitation code privately. No email delivery service is configured.
3. Staff open the activation page, enter the code, and choose their password. Then sign in separately.
4. Screening personnel register a student, create a measurement draft, and submit it from the screening details.
5. Administrator opens the submitted screening and assigns the counsellor.
6. Assigned counsellor begins review, records a counselling action, and schedules a follow-up.
7. Check that the saved records remain after signing out and signing in again.

Sessions use opaque bearer tokens in memory. Refreshing or closing the frontend requires signing in again. Signing out revokes the token on the server. Role changes and deactivation also revoke sessions. Route guards and navigation follow the role; the backend enforces actual record access.

The displayed pages now use backend responses, without falling back to fictional records. Dashboard totals come from /reports/summary; the Recharts activity chart counts visible saved sessions by their created_at date in local time. Student codes are distinct from internal UUIDs. Appointment times entered locally are converted to timezone-aware ISO timestamps. Predictions report the backend's unavailable status until the ML repository is connected.

Older demoStore and unused presentation files are retained to avoid deleting your work. They are not imported by the connected application. No new package dependency was required.

## Verification
- Existing frontend: npm run lint passed without errors or warnings.
- Existing frontend: npm run build passed. Vite reports a non-failing bundle-size advisory.
- Server-render checks: unauthenticated login gate, role-restricted route/navigation and activation page passed.
- Disposable real HTTP integration: login/logout, invitations and single-use activation, student create/read/search, screening create/submit/assignment/review, counselling records, follow-up schedule/reschedule/complete/cancel, operational report, model unavailable response, role restriction and invalid-session handling all passed.
- The integration test used a separate temporary SQLite database and server on 8011. It did not use or modify your project database, staff accounts or records. PostgreSQL-specific behavior has not been verified on your machine.
- Running user backend: /health 200; 27 OpenAPI paths available; CORS preflight 200 for frontend origin. Project database configuration remains incomplete.

For a new checkout, install dependencies with npm ci before npm run dev. For your current checkout, dependencies are already installed. The ZIP is a source snapshot for review/backup; the actual frontend directory was already updated.
