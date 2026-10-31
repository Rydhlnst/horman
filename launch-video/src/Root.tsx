import "./fonts";
import { Composition } from "remotion";
import { Launch } from "./Launch";

export function Root() {
  return (
    <>
      <Composition id="Launch" component={Launch} durationInFrames={360} fps={30} width={1920} height={1080} />
      <Composition id="LaunchSquare" component={Launch} durationInFrames={360} fps={30} width={1080} height={1080} />
    </>
  );
}
