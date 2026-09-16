"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useWallet } from "@/components/wallet/wallet-provider";
import { explorerAccountUrl } from "@/lib/stellar";

const DEMO_KEY = "GDZST3XVCDTUJ76ZAV2HA72KYFL3JCPBHQ4PXESVXHMZQ5MDDG2WXYUP";

export function WalletButton() {
  const { address, short, connect, disconnect } = useWallet();
  const [error, setError] = useState<string | null>(null);

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <a
          href={explorerAccountUrl(address)}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:inline hover:underline font-mono"
        >
          {short}
        </a>
        <button
          type="button"
          onClick={disconnect}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          const result = connect(DEMO_KEY);
          setError(result.ok ? null : result.error);
        }}
        className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition-colors"
      >
        Connect Wallet
      </button>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}
