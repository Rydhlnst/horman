// The "Sign in with Solana" message. Shared by the browser (which signs it) and the
// server (which rebuilds it and checks the signature), so both always agree.
export function signInMessage({ domain, address, nonce, issuedAt }: { domain: string; address: string; nonce: string; issuedAt: string }) {
  return [
    `${domain} wants you to sign in with your Solana account:`,
    address,
    "",
    "Sign in to Horman. This only proves you own this wallet: it sends nothing and costs nothing.",
    "",
    `URI: https://${domain}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
