import type { IconLike } from "@/lib/icons";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";

type Props = {
  Icon?: IconLike;
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  /** Page heads use h1; section heads use h2. */
  page?: boolean;
  children?: ReactNode;
};

/** Left-aligned head: kicker and title on the left, the lede on the right. */
export function Head({ Icon, kicker, title, lede, page = false, children }: Props) {
  const Title = page ? "h1" : "h2";
  return (
    <Reveal className="head">
      <div>
        <span className="kicker">
          {Icon && <Icon />}
          {kicker}
        </span>
        <Title>{title}</Title>
      </div>
      {(lede || children) && (
        <div className="flex flex-col items-start gap-5">
          {lede && <p>{lede}</p>}
          {children}
        </div>
      )}
    </Reveal>
  );
}
