import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { MODEL_GROUPS } from "@/lib/site";

// A plain ledger: four columns split by hairlines, read like a spec sheet.
// Every number here is a fact about the product, not a traction claim.
const MODEL_COUNT = MODEL_GROUPS.reduce((n, g) => n + g.models.length, 0);

const STATS: { label: string; metric: string; sub: string; text: string }[] = [
  {
    label: "Privacy modes",
    metric: "3",
    sub: "Sealed, Ephemeral, Open",
    text: "Pick per chat how much anyone else can see, from nobody at all to a standard provider.",
  },
  {
    label: "Models",
    metric: String(MODEL_COUNT),
    sub: "In the preview lineup",
    text: "Chat, image, video and voice. Open-weight ones run sealed; hosted ones in Open mode.",
  },
  {
    label: "Kept in Sealed",
    metric: "0",
    sub: "Prompts and answers",
    text: "Encrypted on your device, opened only inside the enclave and by you. Nothing is stored.",
  },
  {
    label: "Minimum top-up",
    metric: "$1",
    sub: "USDC, USDT or USDG",
    text: "On Robinhood Chain, turned into private vouchers that never point back to your chats.",
  },
];

export function StatsFolder() {
  return (
    <div className="folder tone-paper lined mt-0">
      <span className="folder-tab">Horman in numbers</span>
      <Stagger className="ledger" gap={0.06}>
        {STATS.map(({ label, metric, sub, text }, i) => (
          <StaggerItem key={label} className="ledger-cell">
            <span className="ledger-key">
              {String(i + 1).padStart(2, "0")}
              <span>{label}</span>
            </span>
            <span className="ledger-num">{metric}</span>
            <div className="ledger-note">
              <strong>{sub}</strong>
              <p>{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
      <p className="ledger-foot">The model count follows the preview lineup and will change as models are confirmed.</p>
    </div>
  );
}
