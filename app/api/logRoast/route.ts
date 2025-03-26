import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { walletAddress, solBalance, usdValue, roast } = body;

    if (
      !walletAddress ||
      solBalance === undefined ||
      usdValue === undefined ||
      !roast
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current date in YYYY-MM-DD format (for timezone consistency)
    const today = new Date().toISOString().split("T")[0];

    // Count today's roasts for this user
    const { count, error: countError } = await supabase
      .from("roast_logs")
      .select("id", { count: "exact", head: true })
      .eq("wallet_address", walletAddress)
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lte("created_at", `${today}T23:59:59.999Z`);

    // Handle potential errors
    if (countError) throw countError;

    // Ensure count is a valid number (default to 0 if null)
    const roastCount = count ?? 0;

    if (roastCount >= 2) {
      return NextResponse.json(
        {
          error:
            "Enough roasts for you today! Any more, and your ego might combust. Come back tomorrow for another verbal slap! 🔥",
        },
        { status: 429 } // HTTP 429 Too Many Requests
      );
    }

    // Insert new roast if under the limit
    const { error } = await supabase.from("roast_logs").insert([
      {
        wallet_address: walletAddress,
        sol_balance: solBalance,
        usd_value: usdValue,
        roast: roast,
      },
    ]);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: "Roast log saved!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving roast log:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
