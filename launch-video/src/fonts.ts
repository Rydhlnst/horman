import { continueRender, delayRender } from "remotion";
import tight800 from "@fontsource/inter-tight/files/inter-tight-latin-800-normal.woff2";
import tight700 from "@fontsource/inter-tight/files/inter-tight-latin-700-normal.woff2";
import tight600 from "@fontsource/inter-tight/files/inter-tight-latin-600-normal.woff2";
import serifItalic from "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2";
import sans400 from "@fontsource/instrument-sans/files/instrument-sans-latin-400-normal.woff2";
import sans500 from "@fontsource/instrument-sans/files/instrument-sans-latin-500-normal.woff2";
import sans600 from "@fontsource/instrument-sans/files/instrument-sans-latin-600-normal.woff2";
import brico700 from "@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-700-normal.woff2";
import mono400 from "@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2";

// The site's own type: Inter Tight headlines, Instrument Serif italic accents,
// Instrument Sans body and Bricolage for the wordmark.
const faces: [string, string, string, string][] = [
  ["Inter Tight", tight800, "800", "normal"],
  ["Inter Tight", tight700, "700", "normal"],
  ["Inter Tight", tight600, "600", "normal"],
  ["Instrument Serif", serifItalic, "400", "italic"],
  ["Instrument Sans", sans400, "400", "normal"],
  ["Instrument Sans", sans500, "500", "normal"],
  ["Instrument Sans", sans600, "600", "normal"],
  ["Bricolage Grotesque", brico700, "700", "normal"],
  ["IBM Plex Mono", mono400, "400", "normal"],
];

const handle = delayRender("Loading fonts");
Promise.all(
  faces.map(([family, url, weight, style]) => {
    const face = new FontFace(family, `url(${url})`, { weight, style });
    document.fonts.add(face);
    return face.load();
  }),
)
  .then(() => continueRender(handle))
  .catch((e) => {
    console.error(e);
    continueRender(handle);
  });
