import { Eye, EyeOff } from "lucide-react";
import { PiGlobeDuotone, PiLockKeyDuotone, PiTimerDuotone } from "react-icons/pi";
import type { IconLike } from "@/lib/icons";
import { MODES, type ModeKey } from "@/lib/site";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

const ICONS: Record<ModeKey, IconLike> = { sealed: PiLockKeyDuotone, ephemeral: PiTimerDuotone, open: PiGlobeDuotone };
const TONES: Record<ModeKey, string> = { sealed: "tone-night", ephemeral: "tone-paper", open: "tone-paper" };

function Access({ can }: { can: boolean }) {
  return can ? (
    <b className="can">
      <Eye /> can read
    </b>
  ) : (
    <b className="cannot">
      <EyeOff /> cannot read
    </b>
  );
}

/** "Choose how much you reveal": the three modes side by side, each with who can read what. */
export function ModeColumns() {
  return (
    <Stagger className="modes">
      {MODES.map((m) => {
        const Icon = ICONS[m.key];
        const [, horman, provider] = m.rows;
        const sealed = m.key === "sealed";
        return (
          <StaggerItem lift key={m.key} className={`mode-col ${TONES[m.key]}`}>
            <div className="flex items-center justify-between gap-3">
              <span className={`grid h-12 w-12 place-items-center rounded-[16px] ${sealed ? "bg-pale text-night" : "bg-mist text-accent"}`}>
                <Icon size={22} />
              </span>
              {sealed && <span className="rounded-full bg-night-2 px-3 py-1 text-[12.5px] font-medium text-pale">Default</span>}
            </div>
            <h3>{m.label}</h3>
            <span className="label">{m.short}</span>
            <p>{m.desc}</p>
            <ul className="mode-who" aria-label={`Who can read what in ${m.label}`}>
              <li>
                Horman <Access can={horman[1] === "yes"} />
              </li>
              <li>
                Model host <Access can={provider[1] === "yes"} />
              </li>
              <li>
                Logs kept <b>{horman[3]}</b>
              </li>
            </ul>
            <p className="mode-fit">{m.fit}</p>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
