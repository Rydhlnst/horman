"use client";

import { Globe, LockKeyhole } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { PiGiftDuotone, PiKeyDuotone } from "react-icons/pi";
import { HormanMark } from "@/components/logo";
import { fadeUp, stagger } from "@/components/motion/reveal";
import { SlidingTabs } from "@/components/watermelon/sliding-tabs";
import { FREE_LIMIT, HOLD, MODEL_GROUPS } from "@/lib/site";

/** The model lineup by kind of work, as a grid of quiet cards. */
export function Models() {
  const [group, setGroup] = useState(MODEL_GROUPS[0].id);
  const current = MODEL_GROUPS.find((g) => g.id === group)!;

  return (
    <div className="folder tone-paper lined models-folder">
      <span className="folder-tab">Preview lineup</span>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SlidingTabs
          label="Kind of model"
          value={group}
          onChange={setGroup}
          items={MODEL_GROUPS.map((g) => ({ id: g.id, label: g.label }))}
        />
      </div>

      <div className="tier-strip">
        <span>
          <PiGiftDuotone size={18} />
          <span>
            <b>Free</b> Auto only, {FREE_LIMIT}. No token needed.
          </span>
        </span>
        <span>
          <PiKeyDuotone size={18} />
          <span>
            <b>Hold {HOLD}</b> to pick any model below.
          </span>
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={group}
          className="model-grid"
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          variants={stagger(0.04)}
        >
          {current.models.map((m) => {
            return (
              <motion.li key={m.name} className="model-card" variants={fadeUp}>
                <div className="model-top">
                  <span className="model-logo" aria-hidden="true">
                    {m.logo ? <Image src={`/models/${m.logo}.svg`} alt="" width={22} height={22} unoptimized /> : <HormanMark size={26} />}
                  </span>
                  {m.free ? (
                    <span className="tier-badge free model-tag">Free</span>
                  ) : (
                    <span className="model-lock model-tag" title={`Hold ${HOLD} to use`}>
                      <PiKeyDuotone size={14} />
                      <span className="sr-only">For holders</span>
                    </span>
                  )}
                </div>
                <div className="model-text">
                  <b className="text-[16px] font-semibold">{m.name}</b>
                  <p className="mt-0.5 text-[14px] leading-snug text-muted">
                    {m.maker} · {m.note}
                  </p>
                </div>
                <p className={`model-where ${m.hosted ? "" : "every"}`}>
                  {m.hosted ? <Globe size={13} /> : <LockKeyhole size={13} />}
                  {m.hosted ? `Every mode · read by ${m.maker}` : "Every mode · private provider"}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
      <p className="mt-4 text-[13px] text-faint">
        Without the token you get Auto, which answers with a light open model. Holders choose any model and pay for use with credit.
        Every model works in every mode. Open-weight models answer through providers that don’t keep or train on your data; hosted
        models are read by the lab that hosts them. The launch lineup may still change.
      </p>
    </div>
  );
}
