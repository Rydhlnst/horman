import "./fonts";
import { Composition } from "remotion";
import { Burn } from "./Burn";
import { HOWTO_FRAMES, HowTo } from "./HowTo";
import { Works, WORKS_FRAMES } from "./Works";
import { SHORT_FRAMES, SHORTS } from "./Shorts";
import { SERIES2 } from "./Series2";
import { U01EveryMode, U01_FRAMES } from "./Update1";
import { U02Onchain, U02_FRAMES } from "./Update2";
import { U03Images, U03_FRAMES } from "./Update3";
import { Launch } from "./Launch";

export function Root() {
  return (
    <>
      <Composition id="Launch" component={Launch} durationInFrames={360} fps={30} width={1920} height={1080} />
      <Composition id="LaunchSquare" component={Launch} durationInFrames={360} fps={30} width={1080} height={1080} />
      <Composition id="Burn" component={Burn} durationInFrames={300} fps={30} width={1920} height={1080} />
      <Composition id="HowTo" component={HowTo} durationInFrames={HOWTO_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="Works" component={Works} durationInFrames={WORKS_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="WorksSquare" component={Works} durationInFrames={WORKS_FRAMES} fps={30} width={1080} height={1080} />
      {SHORTS.map(([id, Comp]) => (
        <Composition key={id} id={id} component={Comp} durationInFrames={SHORT_FRAMES} fps={30} width={1080} height={1080} />
      ))}
      {SERIES2.map(([id, Comp, w, h, d]) => (
        <Composition key={id} id={id} component={Comp} durationInFrames={d} fps={30} width={w} height={h} />
      ))}
      <Composition id="U01-every-mode" component={U01EveryMode} durationInFrames={U01_FRAMES} fps={30} width={1080} height={1080} />
      <Composition id="U02-onchain" component={U02Onchain} durationInFrames={U02_FRAMES} fps={30} width={1080} height={1080} />
      <Composition id="U03-images" component={U03Images} durationInFrames={U03_FRAMES} fps={30} width={1080} height={1080} />
      <Composition id="BurnSquare" component={Burn} durationInFrames={300} fps={30} width={1080} height={1080} />
    </>
  );
}
