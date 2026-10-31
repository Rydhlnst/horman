import type { Metadata } from "next";
import { Head } from "@/components/head";
import { Reveal } from "@/components/motion/reveal";
import { BookOpen, KeyRound } from "lucide-react";
import Link from "next/link";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = { title: "Developers" };

const QUICKSTART = [
  {
    label: "TypeScript",
    code: `npm install @horman/sdk

import { Horman } from "@horman/sdk";

const horman = new Horman({
  apiKey: process.env.HORMAN_KEY,
  mode: "sealed",
});

const reply = await horman.chat({
  model: "auto",
  messages: [{ role: "user", content: "Summarize this report" }],
});
console.log(reply.text);`,
  },
  {
    label: "Python",
    code: `pip install horman

from horman import Horman

horman = Horman(api_key=os.environ["HORMAN_KEY"], mode="sealed")

reply = horman.chat(
    model="auto",
    messages=[{"role": "user", "content": "Summarize this report"}],
)
print(reply.text)`,
  },
];

const IMAGES = [
  {
    label: "TypeScript",
    code: `const image = await horman.images.create({
  prompt: "A quiet mountain lake at sunrise, soft sage tones",
  size: "1024x1024",
});
await image.save("lake.png");`,
  },
  {
    label: "Python",
    code: `image = horman.images.create(
    prompt="A quiet mountain lake at sunrise, soft sage tones",
    size="1024x1024",
)
image.save("lake.png")`,
  },
];

const MCP = [
  {
    label: "mcp.json",
    code: `{
  "mcpServers": {
    "horman": {
      "command": "npx",
      "args": ["@horman/mcp"],
      "env": { "HORMAN_KEY": "your-key", "HORMAN_MODE": "sealed" }
    }
  }
}`,
  },
];

const SECTIONS = [
  ["quickstart", "Quickstart"],
  ["auth", "Authentication"],
  ["modes", "Privacy modes"],
  ["chat", "Chat API"],
  ["images", "Images API"],
  ["mcp", "MCP tools"],
];

const MODE_ROWS = [
  ["sealed", "strongest", "Encrypted to an attested enclave. Horman cannot read the request or the result."],
  ["ephemeral", "no storage", "Processed in memory and discarded after the response."],
  ["open", "widest choice", "Standard processing with more hosted models. Requests may be logged."],
];

const CHAT_PARAMS = [
  ["model", "string", "auto, fast or reasoning."],
  ["messages", "array", "Conversation so far, each with a role and content."],
  ["stream", "boolean", "Return the reply token by token."],
];

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-raise px-1.5 py-px font-mono text-[0.9em] text-fg">{children}</code>;
}

function ParamTable({ rows }: { rows: string[][] }) {
  return (
    <div className="grid gap-2">
      {rows.map(([name, type, text]) => (
        <div
          key={name}
          className="grid grid-cols-[150px_110px_minmax(0,1fr)] items-center gap-3 rounded-[18px] border border-line bg-surface px-5 py-4 text-sm max-[600px]:grid-cols-1 max-[600px]:gap-1.5"
        >
          <code className="justify-self-start rounded-[10px] bg-mist px-2.5 py-1 font-mono text-[13px] text-accent">{name}</code>
          <span className="label">{type}</span>
          <p className="text-muted">{text}</p>
        </div>
      ))}
    </div>
  );
}

function DocSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" id={id} className="flex flex-col gap-4">
      <h2 className="font-display text-[36px] font-extrabold leading-none tracking-[-0.03em] text-fg">{title}</h2>
      {children}
    </Reveal>
  );
}

export default function DevelopersPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={BookOpen}
          kicker="Developers"
          title={
            <>
              Build on the <em>private pipeline.</em>
            </>
          }
          lede="The same pipeline behind the app, for your own products: chat, images and onchain context."
        />
      </section>
      <div className="wrap mt-20 flex flex-wrap items-start gap-12 pb-12">
        <aside
          aria-label="Docs sections"
          className="folder tone-paper lined sticky top-[100px] mt-0 flex max-w-[260px] flex-[1_1_220px] flex-col gap-0.5 p-2.5 max-[860px]:static max-[860px]:max-w-none max-[860px]:flex-row max-[860px]:flex-wrap"
        >
          <span className="folder-tab">On this page</span>
          {SECTIONS.map(([id, label], i) => (
            <a
              key={id}
              href={`#${id}`}
              className="flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[15px] text-muted hover:bg-raise hover:text-fg max-[860px]:py-1.5 max-[860px]:text-sm"
            >
              <span className="text-[12px] font-medium text-faint tabular-nums">{i + 1}</span>
              {label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2 rounded-[18px] bg-night p-4 text-white max-[860px]:hidden">
            <KeyRound size={18} className="text-pale" />
            <span className="text-[14px] leading-snug">API keys come with early access.</span>
            <Link href="/access" className="text-[13px] font-semibold text-pale underline underline-offset-2">
              Request access
            </Link>
          </div>
        </aside>
        <article className="flex min-w-0 flex-[999_1_560px] flex-col gap-20 text-muted">
          <DocSection id="quickstart" title="Quickstart">
            <p className="max-w-[68ch]">Install the SDK and send your first private message.</p>
            <CodeBlock tabs={QUICKSTART} />
          </DocSection>
          <DocSection id="auth" title="Authentication">
            <p className="max-w-[68ch]">
              Every request carries an API key. Keys belong to a project and can be limited to specific modes.
            </p>
            <ul className="flex list-disc flex-col gap-1.5 pl-5">
              <li>Create keys from your dashboard once access is approved.</li>
              <li>Keep keys on your server. Never ship them in a browser bundle.</li>
              <li>Rotate a key at any time; the old one stops working immediately.</li>
            </ul>
          </DocSection>
          <DocSection id="modes" title="Privacy modes">
            <p className="max-w-[68ch]">
              Pass <Code>mode</Code> on the client or per call. A per-call value overrides the client default.
            </p>
            <ParamTable rows={MODE_ROWS} />
          </DocSection>
          <DocSection id="chat" title="Chat API">
            <p className="max-w-[68ch]">
              Send a list of messages and get a reply. Set <Code>model</Code> to <Code>auto</Code> to let Horman choose.
            </p>
            <ParamTable rows={CHAT_PARAMS} />
          </DocSection>
          <DocSection id="images" title="Images API">
            <p className="max-w-[68ch]">Describe an image and get it back as a file. Works in every privacy mode.</p>
            <CodeBlock tabs={IMAGES} />
          </DocSection>
          <DocSection id="mcp" title="MCP tools">
            <p className="max-w-[68ch]">
              Add Horman as an MCP server and any compatible agent gets <Code>horman_chat</Code>, <Code>horman_image</Code>{" "}
              and <Code>horman_onchain</Code>.
            </p>
            <CodeBlock tabs={MCP} />
          </DocSection>
        </article>
      </div>
    </main>
  );
}
