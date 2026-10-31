# $HORMAN launch video

A 12-second Remotion video announcing $HORMAN on Solana, in Horman's colours and type.
It never shows the CA; the outro points people to horman.dev and @hormandotdev for it.

```bash
npm install
npm run studio                                  # preview
npx remotion render src/index.ts Launch out/horman-live-on-solana-16x9.mp4
npx remotion render src/index.ts LaunchSquare out/horman-live-on-solana-1x1.mp4
```

`Launch` is 1920 x 1080 for the X timeline; `LaunchSquare` is 1080 x 1080 for phones.
Not part of the site build (`.vercelignore` leaves this folder out).
