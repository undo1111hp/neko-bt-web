# Nekopara Session House

A simple Express.js practice project for:

- Routing
- Cookies
- Sessions
- Basic login handling
- Access control based on authentication state

The frontend uses a Nekopara-inspired visual style with smooth theme transitions, toast notifications, and mascot assets.

## Features

- Session-based login (no database required)
- Theme switching with cookie persistence (`light` and `dark`)
- Protected profile page
- Per-session profile visit counter
- Logout and session cleanup
- Browser-friendly 404/500 pages
- JSON-compatible API behavior for testing clients

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/` | Home page (HTML) or JSON summary |
| GET | `/login` | Login page (HTML) or JSON login guide |
| POST | `/login` | Authenticate user and create session |
| GET | `/profile` | Protected profile page / profile JSON |
| GET | `/logout` | Destroy session and clear auth state |
| GET | `/set-theme/:theme` | Save theme (`light` or `dark`) in cookie |

## Theme Labels

- `light` -> `Vanilla Day`
- `dark` -> `Midnight Cat`

## Demo Accounts

- `alice / alice123`
- `bob / bob123`
- `demo / demo123`

## Tech Stack

- Node.js
- Express
- express-session
- cookie-parser
- Playwright (E2E tests)

## Setup

Install dependencies:

```bash
npm install
```

Create an `.env` file (you can copy from `.env.example`):

```env
PORT=3000
SESSION_SECRET=replace-with-strong-secret
SESSION_COOKIE_MAX_AGE_MS=1800000
THEME_COOKIE_MAX_AGE_MS=604800000
```

Run in development mode:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

## Mascot Assets

Recommended PNG files:

- `public/assets/characters/choco-mascot.png`
- `public/assets/characters/vanilla-mascot.png`

If PNG files are missing, the UI automatically falls back to the SVG placeholders.

## Manual UX Checklist

1. Open `http://localhost:3000`.
2. Switch theme using `Vanilla Day` and `Midnight Cat`.
3. Go to login and sign in with a demo account.
4. Open profile and refresh multiple times to see the counter increase.
5. Click logout and verify profile is blocked afterward.
6. Visit an unknown route (for example `/abcxyz`) to confirm the 404 page.

## Automated Tests (Playwright)

Run the full suite:

```bash
npm test
```

Run Playwright UI mode:

```bash
npm run test:ui
```

Current coverage includes:

- Home page rendering with Nekopara UI elements
- Smooth theme switching and toast feedback
- Login -> profile -> counter -> logout flow
- Browser 404 page behavior
- JSON API behavior for unauthorized profile access (`401`)
- JSON API behavior for invalid theme values (`400`)

## Notes

- This project is intentionally database-free for learning session and cookie behavior.
- Authentication data is mocked in-memory.
