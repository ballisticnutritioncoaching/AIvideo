# Ballistic 12-Week Program app

The member platform for the $27 Ballistic 12-Week Program: sales page, checkout, onboarding, daily sessions with exercise demos and set logging, a macro calculator and the nutrition library.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Where things live

| What | File |
|---|---|
| Price, booking link, demo mode | `src/lib/config.ts` |
| The program (3 versions x 12 weeks, from the PDF guide) | `src/data/program.ts` |
| Library articles (guide text) | `src/data/library.ts` |
| Brand colors and type | `src/app/globals.css` (Brand Manual 4.0) |
| Macro math (the guide's 5 steps) | `src/lib/macros.ts` |
| Saved progress | `src/lib/store.ts` |

## Demo mode

Right now there's no real login or payment. Checkout creates a demo account, and all progress is saved in the browser (localStorage). To launch:

1. **Payments:** replace the demo step in `src/app/checkout/page.tsx` with a Stripe Checkout session ($27 one-time) and a webhook that creates the member.
2. **Login and sync:** move `src/lib/store.ts` onto Supabase (auth by email link; one table for profile, one for session logs keyed `w{week}d{day}`).
3. **Hosting:** deploy to Vercel and point your domain at it.

## Brand files still needed

- None. The wordmark was supplied as artwork and traced to SVG (`public/brand/wordmark-*.svg`). If you have the original vector file, drop it in with the same names.
