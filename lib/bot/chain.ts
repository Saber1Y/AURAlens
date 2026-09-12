import { defineChain } from "viem";

export const botChain = defineChain({
  id: 677,
  name: "BOT Chain",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.botchain.ai"] },
  },
  blockExplorers: {
    default: { name: "BOT Explorer", url: "https://scan.botchain.ai" },
  },
});

export const botTestnet = defineChain({
  id: 968,
  name: "BOT Chain Testnet",
  nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.bohr.life"] },
  },
  blockExplorers: {
    default: { name: "BOT Explorer", url: "https://scan.bohr.life" },
  },
});

export const BOT_NETWORK_COOKIE = "auralens_bot_network";

export const BOT_NETWORKS = {
  [botChain.id]: {
    chain: botChain,
    label: "MAINNET",
    networkName: "BOT Chain",
    tusdtAddress: "0xaBabc7Ddc03e501d190C676BF3d92ef0e6e87a3C" as `0x${string}`,
  },
  [botTestnet.id]: {
    chain: botTestnet,
    label: "TESTNET",
    networkName: "BOT Chain Testnet",
    tusdtAddress: "0x75edC9335175Fc0552D51D48439F229c10420fe3" as `0x${string}`,
  },
} as const;

export function getBotNetwork(chainId: number = botChain.id) {
  return BOT_NETWORKS[chainId as keyof typeof BOT_NETWORKS] ?? BOT_NETWORKS[botChain.id];
}

export const TUSDT_ADDRESS = BOT_NETWORKS[botChain.id].tusdtAddress;

export const TUSDT_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const;
