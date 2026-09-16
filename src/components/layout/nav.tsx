"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BarChart3, Settings, Zap, Code2, Activity, Grid3x3 } from "lucide-react";
import { HorizonStatus } from "@/components/stellar/horizon-status";
import { WalletButton } from "@/components/wallet/wallet-button";

export function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Overview", icon: Grid3x3 },
    { href: "/registry", label: "Registry", icon: Zap },
    { href: "/agents", label: "Agents", icon: Code2 },
    { href: "/budgets", label: "Budgets", icon: Activity },
    { href: "/transactions", label: "Transactions", icon: BarChart3 },
    { href: "/webhooks", label: "Webhooks", icon: Settings },
  ];

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-3">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.jpg" alt="Primer" width={32} height={32} className="rounded" />
            <span className="font-semibold text-lg hidden sm:inline">Primer</span>
          </Link>

          <div className="flex items-center gap-1 overflow-x-auto">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap",
                  pathname === href
                    ? "bg-violet-100 text-violet-900 dark:bg-violet-900/30 dark:text-violet-200"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <HorizonStatus className="hidden md:inline-flex" />
            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
