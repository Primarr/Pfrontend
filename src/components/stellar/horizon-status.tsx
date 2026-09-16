"use client";

import { useEffect, useState } from "react";
import { pingHorizon, stellar } from "@/lib/stellar";
import { cn } from "@/lib/utils";

export function HorizonStatus({ className }: { className?: string }) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    pingHorizon().then((reachable) => {
      if (!cancelled) setOk(reachable);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const label =
    ok === null ? "Checking Horizon…" : ok ? `Horizon ${stellar.network}` : "Horizon unreachable";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        ok === null && "text-zinc-500",
        ok === true && "text-emerald-700 dark:text-emerald-400",
        ok === false && "text-amber-700 dark:text-amber-400",
        className
      )}
      title={stellar.horizonUrl}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          ok === null && "bg-zinc-400",
          ok === true && "bg-emerald-500",
          ok === false && "bg-amber-500"
        )}
      />
      {label}
    </span>
  );
}
