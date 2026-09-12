import { createPublicClient, http } from "viem";
import { botChain, getBotNetwork, TUSDT_ABI } from "@/lib/bot/chain";
import type { AuraAnalysis, AuraBotRead, AuraNetworkPortfolio, AuraToken } from "@/lib/aura/types";

export type BotBalances = {
  nativeBOT: number;
  tusdt: number;
};

export async function readBotBalances(address: string, chainId: number = botChain.id): Promise<BotBalances | null> {
  try {
    const network = getBotNetwork(chainId);
    const botClient = createPublicClient({
      chain: network.chain,
      transport: http(network.chain.rpcUrls.default.http[0]),
    });
    const [nativeBigInt, tusdtBigInt, decimals] = await Promise.all([
      botClient.getBalance({ address: address as `0x${string}` }),
      botClient.readContract({
        address: network.tusdtAddress,
        abi: TUSDT_ABI,
        functionName: "balanceOf",
        args: [address as `0x${string}`],
      }),
      botClient.readContract({
        address: network.tusdtAddress,
        abi: TUSDT_ABI,
        functionName: "decimals",
      }),
    ]);

    return {
      nativeBOT: Number(nativeBigInt) / 10 ** 18,
      tusdt: Number(tusdtBigInt) / 10 ** Number(decimals),
    };
  } catch {
    return null;
  }
}

export async function augmentWithBotChain(analysis: AuraAnalysis, chainId: number = botChain.id): Promise<AuraAnalysis> {
  const network = getBotNetwork(chainId);
  const balances = await readBotBalances(analysis.address, chainId);
  if (!balances) return analysis;

  const tokens = buildBotTokens(balances, chainId);
  const botEntry = buildBotEntry(balances, chainId);
  if (tokens.length === 0) return analysis;

  return {
    ...analysis,
    portfolio: [botEntry],
    totalBalanceUSD: 0,
    networkCount: 1,
    assetCount: tokens.length,
    bot: {
      chainId: String(network.chain.id),
      network: network.networkName,
      rpcUrl: network.chain.rpcUrls.default.http[0],
      explorerUrl: network.chain.blockExplorers.default.url,
      balances,
    },
  };
}

export function buildBotTokens(balances: BotBalances, chainId: number = botChain.id): AuraToken[] {
  const tusdtAddress = getBotNetwork(chainId).tusdtAddress;
  const tokens: AuraToken[] = [];
  if (balances.nativeBOT > 0) {
    tokens.push({
      symbol: "BOT",
      balance: balances.nativeBOT,
      balanceUSD: 0,
      decimals: 18,
    });
  }
  if (balances.tusdt > 0) {
    tokens.push({
      symbol: "USDT",
      balance: balances.tusdt,
      balanceUSD: 0,
      decimals: 6,
       address: tusdtAddress,
    });
  }
  return tokens;
}

export function buildBotEntry(balances: BotBalances, chainId: number = botChain.id): AuraNetworkPortfolio {
  const network = getBotNetwork(chainId);
  return {
    network: {
       name: network.networkName,
       chainId: String(network.chain.id),
       explorerUrl: network.chain.blockExplorers.default.url,
    },
     tokens: buildBotTokens(balances, chainId),
    totalBalanceUSD: 0,
  };
}

export function formatBotRead(read: AuraBotRead): string {
  const entries: string[] = [];
  if (read.balances.nativeBOT > 0) entries.push(`${read.balances.nativeBOT.toFixed(4)} BOT`);
  if (read.balances.tusdt > 0) entries.push(`${read.balances.tusdt.toFixed(4)} USDT`);
  return entries.length > 0 ? entries.join(" · ") : "No BOT Chain assets found";
}
