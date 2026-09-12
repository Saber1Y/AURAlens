"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { BOT_NETWORK_COOKIE, botChain, botTestnet } from "@/lib/bot/chain";

const options = [
  { id: botTestnet.id, label: "TESTNET" },
  { id: botChain.id, label: "MAINNET" },
];

export function NetworkToggle() {
  const router = useRouter();
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    const saved = window.localStorage.getItem(BOT_NETWORK_COOKIE);
    if (saved === String(botTestnet.id) || saved === String(botChain.id)) {
      document.cookie = `${BOT_NETWORK_COOKIE}=${saved}; path=/; max-age=31536000`;
    }
  }, []);

  const selectNetwork = (nextChainId: number) => {
    window.localStorage.setItem(BOT_NETWORK_COOKIE, String(nextChainId));
    document.cookie = `${BOT_NETWORK_COOKIE}=${nextChainId}; path=/; max-age=31536000`;
    if (isConnected && chainId !== nextChainId) {
      switchChain({ chainId: nextChainId });
    }
    router.refresh();
  };

  return (
    <div className="network-toggle" role="group" aria-label="Select BOT Chain network">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={chainId === option.id ? "active" : ""}
          onClick={() => selectNetwork(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
