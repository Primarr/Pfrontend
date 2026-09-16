"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isStellarPublicKey, shortenAddress } from "@/lib/stellar";

const STORAGE_KEY = "primer_wallet_pubkey";

type WalletState = {
  address: string | null;
  short: string | null;
  connect: (address: string) => { ok: true } | { ok: false; error: string };
  disconnect: () => void;
};

const WalletContext = createContext<WalletState | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isStellarPublicKey(saved)) setAddress(saved);
  }, []);

  const connect = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!isStellarPublicKey(trimmed)) {
      return { ok: false as const, error: "Enter a valid Stellar G… public key" };
    }
    localStorage.setItem(STORAGE_KEY, trimmed);
    setAddress(trimmed);
    return { ok: true as const };
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
  }, []);

  const value = useMemo(
    () => ({
      address,
      short: address ? shortenAddress(address) : null,
      connect,
      disconnect,
    }),
    [address, connect, disconnect]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    return {
      address: null,
      short: null,
      connect: () => ({ ok: false, error: "Wallet provider missing" }),
      disconnect: () => undefined,
    };
  }
  return ctx;
}
