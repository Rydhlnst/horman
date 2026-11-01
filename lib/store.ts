// Server-only: credit balances and payments in Postgres (Neon on Vercel).
// Reads DATABASE_URL, or POSTGRES_URL as Vercel's Neon integration also sets it.
import "server-only";
import { Pool } from "pg";

const url = () => process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
export const storeConfigured = () => url() !== "";

// One small pool per server instance; serverless instances stay well under Neon's limits.
let pool: Pool | null = null;
let ready: Promise<void> | null = null;

function db(): Pool {
  if (!storeConfigured()) throw new Error("Store not configured");
  pool ??= new Pool({ connectionString: url(), max: 3, idleTimeoutMillis: 10_000, connectionTimeoutMillis: 6000 });
  return pool;
}

/** Creates the two tables on first use, once per instance. */
async function q<T extends object>(text: string, params: unknown[] = []): Promise<T[]> {
  ready ??= db()
    .query(
      `CREATE TABLE IF NOT EXISTS horman_credit (
         address text PRIMARY KEY,
         cents bigint NOT NULL DEFAULT 0
       );
       CREATE TABLE IF NOT EXISTS horman_payment (
         id text PRIMARY KEY,
         address text NOT NULL,
         usd numeric NOT NULL,
         status text NOT NULL,
         pay_address text,
         pay_amount numeric,
         credited boolean NOT NULL DEFAULT false,
         created_at timestamptz NOT NULL DEFAULT now()
       );
       -- Usage is charged in fractions of a cent.
       ALTER TABLE horman_credit ALTER COLUMN cents TYPE numeric(20,6);`,
    )
    .then(() => undefined)
    .catch((e) => {
      ready = null;
      throw e;
    });
  await ready;
  return (await db().query(text, params)).rows as T[];
}

/** Credit in US cents for a wallet, with fractions of a cent. */
export async function getCredit(address: string): Promise<number> {
  const rows = await q<{ cents: string }>("SELECT cents FROM horman_credit WHERE address = $1", [address]);
  return Number(rows[0]?.cents ?? 0);
}

/**
 * Credits a stored payment to the wallet that started it, once, however many times it's
 * called: marking the payment and adding the credit happen in one statement.
 * Returns true if it credited now.
 */
export async function creditOnce(paymentId: string, cents: number): Promise<boolean> {
  const rows = await q(
    `WITH p AS (
       UPDATE horman_payment SET credited = true WHERE id = $1 AND NOT credited RETURNING address
     )
     INSERT INTO horman_credit (address, cents) SELECT address, $2 FROM p
     ON CONFLICT (address) DO UPDATE SET cents = horman_credit.cents + EXCLUDED.cents
     RETURNING cents`,
    [paymentId, Math.round(cents)],
  );
  return rows.length > 0;
}

/** Takes usage off a wallet's credit, never below zero. Returns the new balance in cents. */
export async function debit(address: string, cents: number): Promise<number> {
  const rows = await q<{ cents: string }>(
    "UPDATE horman_credit SET cents = GREATEST(cents - $2, 0) WHERE address = $1 RETURNING cents",
    [address, Math.max(0, cents).toFixed(6)],
  );
  return Number(rows[0]?.cents ?? 0);
}

export type PaymentRecord = { address: string; usd: number; status: string; payAddress?: string; payAmount?: number; createdAt: string };

export async function savePayment(id: string, rec: PaymentRecord) {
  await q(
    `INSERT INTO horman_payment (id, address, usd, status, pay_address, pay_amount, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status`,
    [id, rec.address, rec.usd, rec.status, rec.payAddress ?? null, rec.payAmount ?? null, rec.createdAt],
  );
}

export async function getPayment(id: string): Promise<PaymentRecord | null> {
  const rows = await q<{ address: string; usd: string; status: string; pay_address: string | null; pay_amount: string | null; created_at: Date }>(
    "SELECT address, usd, status, pay_address, pay_amount, created_at FROM horman_payment WHERE id = $1",
    [id],
  );
  const r = rows[0];
  if (!r) return null;
  return {
    address: r.address,
    usd: Number(r.usd),
    status: r.status,
    payAddress: r.pay_address ?? undefined,
    payAmount: r.pay_amount === null ? undefined : Number(r.pay_amount),
    createdAt: new Date(r.created_at).toISOString(),
  };
}
