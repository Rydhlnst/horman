# Horman (private AI workspace)

Next.js 16 + Tailwind 4 build of the "Horman Website Preview" design
(claude.ai/artifact/5n2Bvbm6CqZ5oMsLQbCqLT). The logo, colours, type and copy follow that artifact.

```bash
npm install
npm run dev   # http://localhost:3280
```

## Pages

| Route         | What it is                                                        |
| ------------- | ----------------------------------------------------------------- |
| `/`           | Landing: hero mode switch, workspace, Sealed steps, modes, FAQ    |
| `/chat`       | Chat app (sample replies, sample images, top-up dialog)           |
| `/pricing`    | Free vs Credit, per-use price table                               |
| `/developers` | Docs: quickstart, auth, modes, Chat/Images API, MCP               |
| `/access`     | Early access form                                                 |
| `/topup`      | How a top-up works plus the amount picker; links to `/chat#topup` |
| `/agents`     | Agent templates with a preview run, and the agents tutorial video |
| `/onchain`    | Solana wallet, token and program lookup demo, and the onchain video |
| `/guides`     | Every tutorial and how-it-works video                             |

## Where things live

- `components/logo.tsx` – the Horman mark (four sage petals on a dark green tile) and the wordmark.
  `app/icon.svg` and `public/brand/horman-mark.svg` are the same mark as files.
- `app/globals.css` – colour tokens and the shared `btn`, `card`, `pill`, `eyebrow`, `h2`, `lede`, `input` utilities.
- `lib/site.ts` – privacy modes, nav menus and top-up limits.
- `components/chat/` – the chat app. Chats are kept in this browser's localStorage; Ephemeral chats are never saved.

## CA (mint address) and domain

The site lives at https://horman.dev (`SITE_URL` in `lib/site.ts`; used for metadata, robots and sitemap).
The Copy CA buttons (hero, top bar, menu, footer) read `NEXT_PUBLIC_CA`. Until it is set they say the
address is announced at launch. Set it in Vercel, then redeploy: `NEXT_PUBLIC_` values are built in.

## Product videos

The tutorials and how-it-works videos are made with Remotion in `video/`, a separate package
(not part of the site build; `.vercelignore` leaves it out). They import the logo and the sample
data from the site, so they stay in step with it. Metadata for the site is in `lib/videos.ts`.

```bash
cd video && npm install
npm run studio                       # preview on port 3290
npm run render                       # every video into ../public/videos (mp4 + jpg poster)
node scripts/render.mjs AgentsTutorial   # just one
```

On the site, `components/product-video.tsx` plays a video muted while it is on screen, with a
pause button that always works.

## Wallet sign-in (Solana)

`Connect wallet` sits in the top bar, the phone menu and the chat header. It lists every
Solana wallet the browser has (Phantom, Solflare, Backpack and anything on the Wallet
Standard; the Mobile Wallet Adapter on Android) and, on a phone without one, links to open
the site inside Phantom or Solflare. After connecting, the wallet signs one message
("Sign in with Solana": no transaction, no fee). The server checks it and sets a signed
session cookie.

- `components/wallet/` – the provider, session context and the button with its picker.
- `app/api/auth/` – `nonce`, `verify`, `session` and `logout`.
- `lib/auth.ts` – signature check, the session cookie and the `$HORMAN` balance read over
  `SOLANA_RPC_URL`. `lib/siws.ts` is the signed message, shared by browser and server.
- Holder access: a signed-in wallet with a `$HORMAN` balance (at least `HOLD_MIN` in
  `lib/site.ts` once that is set) can pick every model. Before `NEXT_PUBLIC_CA` is set
  nobody is a holder.
- Needs `SESSION_SECRET`; see `.env.example`.

## Chat (live beta)

`/api/chat` streams answers from OpenRouter (`OPENROUTER_API_KEY`). Auto is free for
everyone; every other model needs a signed-in holder wallet (or one in `HOLDER_ALLOWLIST`).
Hosted models (GPT, Claude, Gemini) are Open mode only; Sealed and Ephemeral ask OpenRouter
for providers that don't collect data. Sealed enclaves are not live yet, and the chat says so.
Limits are per server instance (20 messages per 10 minutes free, 60 for holders) until a
shared store such as Upstash is connected. `lib/models.ts` maps each tier to the newest
matching OpenRouter model; `lib/ask.ts` is the browser side.

## Still a preview

- Images are samples; no image model is wired in yet.
- Wallet payment, the early-access form and the API/SDK packages do not exist yet. Wallet sign-in works; nothing else is sent anywhere.
- Copy still has placeholders: `[MODEL LIST]`, `[N]` and `[PRICE]`.

## Logos and borrowed UI

- Model maker logos in `public/models/` come from LobeHub Icons (`@lobehub/icons-static-svg`, MIT). They are the makers' trademarks, shown only to name the model.
- `components/watermelon/` holds adapted copies of Watermelon UI components (MIT, https://ui.watermelon.sh): sliding tabs, split accordion and copy button. The ⌘K search follows its command-search.
- `components/blocks/` adapts Watermelon UI blocks (MIT) inside Horman folder cards: announcement-1 (bar over the navbar), stats-2, newsletter-3 (hands the email to /access), cta-3, and error-1 for the 404 page. The navbar follows navigation-3. Testimonials, team, blog, career and auth blocks are not used: there is no real content for them yet.
- Feature icons are Phosphor Duotone through `react-icons/pi`; small UI marks stay on lucide.
- `/onchain` and `/agents` are the two pages that set Horman apart: a lookup demo (wallet, token, program on Solana) and an agent template demo. Their data lives in `lib/onchain.ts` and `lib/agents.ts`; addresses are made up and every number is a sample.
- The model lineup in `lib/site.ts` (`MODEL_GROUPS`) is a preview and still needs confirming before launch.
