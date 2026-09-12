import { isAddress } from "viem";
import { AuraApiError, getAuraStrategies } from "@/lib/aura/client";
import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { cookies } from "next/headers";
import { BOT_NETWORK_COOKIE, botChain, botTestnet } from "@/lib/bot/chain";

type WorkspaceView = "overview" | "strategies" | "developer";

export async function DashboardRoute({ view, searchParams }: { view: WorkspaceView; searchParams: Promise<{ address?: string }> }) {
  const { address = "" } = await searchParams;
  const cookieValue = (await cookies()).get(BOT_NETWORK_COOKIE)?.value;
  const chainId = cookieValue === String(botTestnet.id) ? botTestnet.id : botChain.id;
  let analysis = null;
  let error = "";

  if (address) {
    if (!isAddress(address)) error = "Enter a valid EVM wallet address.";
    else {
      try {
        analysis = await getAuraStrategies(address, chainId);
      } catch (caught) {
        error = caught instanceof AuraApiError ? caught.message : "AURA could not analyze this wallet.";
      }
    }
  }

  return <DashboardWorkspace key={`${view}-${address}-${chainId}`} view={view} analysis={analysis} initialAddress={address} initialError={error} />;
}
