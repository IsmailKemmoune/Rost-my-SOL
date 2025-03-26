import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { balanceUSD, walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    if (balanceUSD === null || balanceUSD === undefined) {
      return NextResponse.json(
        { error: "Balance is required" },
        { status: 400 }
      );
    }

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Count today's roasts for this user
    const { count, error: countError } = await supabase
      .from("roast_logs")
      .select("id", { count: "exact", head: true })
      .eq("wallet_address", walletAddress)
      .gte("created_at", `${today}T00:00:00.000Z`)
      .lte("created_at", `${today}T23:59:59.999Z`);

    if (countError) throw countError;

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

    // Generate a roast only if under the limit
    const prompt = `You are a witty, sarcastic, and humorous AI that loves roasting people in a lighthearted and funny way. I will provide you with a user's Solana balance converted to USD, and your task is to generate a hilarious roast based on how much (or how little) money they have. Be creative, use puns, pop culture references, and clever wordplay. The roast should be funny but not mean-spirited—keep it playful and entertaining. Here’s the user’s Solana balance in USD: $${balanceUSD.toFixed(
      2
    )}. Now, roast them!`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      max_tokens: 100,
    });

    return NextResponse.json({
      roast: response.choices[0]?.message?.content || "No roast for you today!",
    });
  } catch (error) {
    console.error("Error generating roast:", error);
    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}
