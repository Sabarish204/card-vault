# CardVault

![Angular](https://img.shields.io/badge/Angular-21.1.x-DD0031?logo=angular&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-21.1.x-3B82F6)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.x-3178C6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

CardVault is a single-page Angular application for storing and managing credit/debit card records on your local device. The app uses a passphrase-gated vault flow, lets you add/edit/delete cards, and persists data in browser `localStorage`.

**Production URL:** https://card-vault-delta.vercel.app/unlock

## Project Description

CardVault provides a lightweight UI to:
- unlock a local vault using a passphrase,
- store card entries (issuer, bank, holder, number, expiry, CVV),
- edit/delete saved cards,
- quickly copy card numbers,
- lock or reset the vault.

It is built as a standalone Angular app with PrimeNG components and optional PWA support via Angular Service Worker.

## Features

- Passphrase-based vault unlock screen
- Route guard for protected card pages
- Add/Edit/Delete card workflows
- Form validation (expiry, card fields, issuer-based CVV length)
- Local persistence via `localStorage`
- Copy card number to clipboard
- Reset vault confirmation dialogs
- PWA manifest + service worker (enabled in production build)

## Screenshots

Add your screenshots in `docs/screenshots/` and update links below.

![Unlock Screen](docs/screenshots/unlock-screen.png)
![Cards List](docs/screenshots/cards-list.png)
![Add Card Form](docs/screenshots/add-card-form.png)

## Tech Stack (with Versions)

### Core Framework
- Angular `^21.1.0` (`@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, etc.)
- Angular CLI `^21.1.2`
- Angular Build System `@angular/build ^21.1.2`
- Angular Service Worker `^21.1.0`

### UI and Styling
- PrimeNG `^21.1.1`
- PrimeNG Theme Preset (`@primeng/themes`) `^21.0.4` (Aura)
- PrimeFlex `^4.0.0`
- PrimeIcons `^7.0.0`

### Language and Tooling
- TypeScript `~5.9.2`
- RxJS `~7.8.0`
- tslib `^2.3.0`
- npm `11.6.2` (from `packageManager`)

### Testing/Dev Utilities
- Vitest `^4.0.8`
- jsdom `^27.1.0`

## Prerequisites

- Node.js (LTS recommended)
- npm (project configured with `npm@11.6.2`)
- Angular CLI (optional globally; project scripts use local CLI)

## Clone and Run Locally

1. Clone the repository:

```bash
git clone <your-repo-url>
cd card-vault
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm start
```

4. Open in browser:

```text
http://localhost:4200
```

## Available Scripts

- `npm start` - run Angular dev server
- `npm run build` - create production build
- `npm run watch` - development build in watch mode
- `npm test` - run unit tests

## Build for Production

```bash
npm run build
```

Production output is generated in `dist/`.

## Deployment

CardVault is deployed on **Vercel**.

- **Production URL:** https://card-vault-delta.vercel.app/unlock
- **Platform:** Vercel
- **Framework Preset:** Angular
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Routing:** Configure SPA rewrite/fallback to `index.html` for client-side routes.

### Vercel Deployment Steps

1. Import the GitHub repository in Vercel.
2. Set build command to `npm run build`.
3. Set output directory to `dist/`.
4. Add SPA rewrite to `index.html` for Angular routes (like `/unlock`, `/cards`).
5. Deploy and verify the production URL.

## Project Structure (High Level)

- `src/app/vault/` - unlock and vault state logic
- `src/app/cards/` - card form, list, add/edit flows, local store service
- `public/` - icons, manifest, branding assets
- `ngsw-config.json` - service worker asset caching configuration

## Contributing

1. Fork the repository
2. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```
3. Make your changes and test locally:
```bash
npm test
npm run build
```
4. Commit using clear messages
5. Push your branch and open a Pull Request

### Recommended Contribution Rules

- Keep PRs focused and small.
- Add/update tests when behavior changes.
- Match existing code style and naming patterns.
- Document user-visible changes in `README.md` when needed.

## Security Notes

- Data is stored locally in the browser (`localStorage`) on the same device/profile.
- Current encryption logic is demo/mock style and not suitable for real financial data protection.
- Do not use real card details in development/demo environments.

## Suggested Improvements

- Replace mock encryption with audited Web Crypto API-based encryption
- Add proper auth/session timeout and brute-force protections
- Add e2e tests for vault + card management flows
- Add import/export (encrypted backup) support
- Add CI checks (lint, test, build)

## License

MIT (update this section if your project uses a different license).
