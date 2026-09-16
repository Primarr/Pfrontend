const STELLAR_ACCOUNT = /^G[A-Z2-7]{55}$/;
const STELLAR_CONTRACT = /^C[A-Z2-7]{55}$/;

export type StellarNetwork = "testnet" | "public";

const network = (process.env.NEXT_PUBLIC_STELLAR_NETWORK || "testnet") as StellarNetwork;
const isPublic = network === "public";

export const stellar = {
  network,
  networkPassphrase: isPublic
    ? "Public Global Stellar Network ; September 2015"
    : "Test SDF Network ; September 2015",
  horizonUrl:
    process.env.NEXT_PUBLIC_HORIZON_URL ||
    (isPublic ? "https://horizon.stellar.org" : "https://horizon-testnet.stellar.org"),
  explorerBase: isPublic
    ? "https://stellar.expert/explorer/public"
    : "https://stellar.expert/explorer/testnet",
};

export function isStellarPublicKey(value: string): boolean {
  return Boolean(value) && STELLAR_ACCOUNT.test(value.trim());
}

export function isStellarContractId(value: string): boolean {
  return Boolean(value) && STELLAR_CONTRACT.test(value.trim());
}

/** @deprecated use isStellarPublicKey */
export function validateStellarAddress(address: string): boolean {
  return isStellarPublicKey(address);
}

export function formatAmount(amount: number | string, decimals = 7): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!Number.isFinite(num)) return "0";
  return num.toFixed(decimals).replace(/\.?0+$/, "");
}

export function shortenAddress(address: string, head = 4, tail = 4): string {
  if (!address || address.length < head + tail + 3) return address;
  return `${address.slice(0, head)}…${address.slice(-tail)}`;
}

export function explorerAccountUrl(address: string): string {
  return `${stellar.explorerBase}/account/${address}`;
}

export function explorerTxUrl(hash: string): string {
  return `${stellar.explorerBase}/tx/${hash}`;
}

export async function pingHorizon(timeoutMs = 2500): Promise<boolean> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${stellar.horizonUrl.replace(/\/$/, "")}/`, {
      signal: ctrl.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export const USDC_CODE = "USDC";
export const USDC_ISSUER =
  process.env.NEXT_PUBLIC_USDC_ISSUER ||
  "GBBD47UZQ5SMAZX5VK6MKBQNRYPKH376I6BGZ4SHAMEZVXC6YCKCCTVL";
