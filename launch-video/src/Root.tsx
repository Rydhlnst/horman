import "./fonts";
import { Composition } from "remotion";
import { Burn } from "./Burn";
import { HOWTO_FRAMES, HowTo } from "./HowTo";
import { Works, WORKS_FRAMES } from "./Works";
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
      <Composition id="BurnSquare" component={Burn} durationInFrames={300} fps={30} width={1080} height={1080} />
    </>
  );
}
