import {
  Bell,
  CalendarClock,
  Check,
  ImageIcon,
  Mic,
  Paperclip,
  Search,
  Sparkles,
  TriangleAlert,
  Video,
} from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/reveal";

function ChatMock() {
  return (
    <div className="mock">
      <div className="mock-head">
        <span>Auto · picked Reasoning</span>
        <b className="mock-tag light">sealed</b>
      </div>
      <span className="mock-bubble">Explain my blood test in plain words. Anything to ask my doctor?</span>
      <div className="mock-row">
        <Paperclip /> bloodwork-june.pdf <span>3 pages</span>
      </div>
      <div className="mock-row">
        <Search /> 6 medical sources checked <span>web</span>
      </div>
      <div className="mock-row">
        <Check className="ok" /> Two values to raise, four look normal <span>answer</span>
      </div>
    </div>
  );
}

function CreateMock() {
  return (
    <div className="mock">
      <div className="mock-head">
        <span>Create · 4 outputs</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["#b7c7bc", "#4e6b5c", ImageIcon, "Image"],
          ["#e4ece6", "#8fa89a", Video, "Clip · 6s"],
          ["#c9d7cd", "#3a4d42", Mic, "Voiceover"],
          ["#eef1e6", "#7e9a8a", Sparkles, "Edit"],
        ].map(([bg, fg, Icon, label]) => {
          const I = Icon as typeof ImageIcon;
          return (
            <div key={label as string} className="flex h-[74px] flex-col justify-between rounded-[12px] p-2.5" style={{ background: bg as string, color: fg as string }}>
              <I size={16} />
              <span className="text-[12px] font-medium text-fg/70">{label as string}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentMock() {
  return (
    <div className="mock">
      <div className="mock-head">
        <span>Agent · running privately</span>
      </div>
      <div className="mock-row">
        <CalendarClock /> Every Monday · 08:00 <span>brief</span>
      </div>
      <div className="mock-row">
        <Check className="ok" /> 38 sources read <span>2m 10s</span>
      </div>
      <div className="mock-row">
        <Bell /> Tell me when a rival ships <span>watch</span>
      </div>
    </div>
  );
}

function OnchainMock() {
  return (
    <div className="mock">
      <div className="mock-head">
        <span>0x7a3f…e91c · 24h</span>
        <b className="mock-tag warn">1 flag</b>
      </div>
      <div className="mock-row">
        <Check className="ok" /> Tagged: market maker <span>12 wallets</span>
      </div>
      <div className="mock-row">
        <TriangleAlert className="warn" /> Fresh contract, not verified
      </div>
      <div className="mock-row">
        <Check className="ok" /> Liquidity moved to a stable pair
      </div>
    </div>
  );
}

function ApiMock() {
  return (
    <div className="mock">
      <div className="mock-code">{`await horman.chat({
  mode: "sealed",
  model: "auto",
  messages,
});`}</div>
    </div>
  );
}

const CARDS = [
  { tone: "night", tag: "Chat", title: "Ask anything, any model.", text: "Quick facts to deep research. Auto picks the right model.", Mock: ChatMock },
  { tone: "pale", tag: "Create", title: "A sentence becomes a picture.", text: "Images, short clips, voiceovers and music.", Mock: CreateMock },
  { tone: "sage", tag: "Agents", title: "Hand off the busywork.", text: "Research, monitoring and reports that run privately too.", Mock: AgentMock },
  { tone: "paper", tag: "Onchain · built in", title: "Read the chain in plain words.", text: "Labeled, scored answers about any wallet or contract.", Mock: OnchainMock },
  { tone: "mist", tag: "Developers", title: "The same pipeline, in your app.", text: "API, SDKs and MCP tools with the same modes.", Mock: ApiMock },
];

/** Everything Horman does as one bento: Chat wide on top, the rest below. */
export function WorkspaceBento() {
  return (
    <Stagger className="bento">
      {CARDS.map(({ tone, tag, title, text, Mock }, i) => (
        <StaggerItem
          lift
          key={tag}
          id={tag === "Create" ? "create" : tag === "Agents" ? "agents" : undefined}
          className={`bento-card tone-${tone} ${i === 0 ? "wide" : ""}`}
        >
          <div className="flex flex-col gap-3.5">
            <span className="label">{tag}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
          <Mock />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
