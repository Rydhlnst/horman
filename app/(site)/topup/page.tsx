import { Wallet } from "lucide-react";
import type { Metadata } from "next";
import { Head } from "@/components/head";
import { ProductVideo } from "@/components/product-video";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";
import { TopupSteps, TopupVoucher } from "@/components/topup-card";

export const metadata: Metadata = { title: "Top up credit" };

export default function TopupPage() {
  return (
    <main>
      <section className="wrap pt-16">
        <Head
          page
          Icon={Wallet}
          kicker="Top up"
          title={
            <>
              Credit that never <em>points back to you.</em>
            </>
          }
        >
          <p>
            Credit pays for every model, at the prices on{" "}
            <Link className="text-accent underline underline-offset-2" href="/pricing">
              Pricing
            </Link>
            . Each dollar becomes a private voucher made in your browser.
          </p>
        </Head>
      </section>
      <Reveal className="wrap mt-20 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-5 max-[900px]:grid-cols-1 max-[900px]:gap-14">
        <TopupSteps />
        <TopupVoucher />
      </Reveal>

      <section className="section">
        <Head
          kicker="Tutorial"
          title={
            <>
              A top-up, <em>start to finish.</em>
            </>
          }
          lede="Pick an amount, pay in USDC, USDT or USDG on Robinhood Chain, and watch it land as private vouchers."
        />
        <Reveal className="folder tone-paper lined video-tabs">
          <span className="folder-tab">Video · sample data</span>
          <ProductVideo id="topup-tutorial" />
        </Reveal>
      </section>
    </main>
  );
}
