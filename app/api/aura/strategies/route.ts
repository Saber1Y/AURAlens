import { NextRequest, NextResponse } from "next/server";
import { AuraApiError, getAuraStrategies } from "@/lib/aura/client";
import { botChain, botTestnet } from "@/lib/bot/chain";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address")?.trim() ?? "";
  const chainId = request.nextUrl.searchParams.get("chainId") === String(botTestnet.id) ? botTestnet.id : botChain.id;

  try {
    const analysis = await getAuraStrategies(address, chainId);
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof AuraApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { error: "Unexpected error while contacting AURA." },
      { status: 502 },
    );
  }
}
