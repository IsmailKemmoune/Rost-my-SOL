"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "../ui/button";
import { Wallet, Zap } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { AddressWithCopy } from "./AddressWithCopy";

const CustomWalletButton = dynamic(() => import("./CustomWalletButton"), {
  ssr: false,
});

export default function UserWalletCard() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [roast, setRoast] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        setBalance(balance / 1e9); // Convert lamports to SOL
      }
    };

    fetchBalance();
  }, [publicKey, connection]);

  useEffect(() => {
    const fetchSolPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
        );
        const data = await response.json();
        setSolPrice(data.solana.usd);
      } catch (error) {
        console.error("Error fetching SOL price:", error);
      }
    };

    fetchSolPrice();
  }, []);

  useEffect(() => {
    if (connected && balance !== null && solPrice !== null) {
      generateRoast();
    }
  }, [connected, balance, solPrice]);

  console.log(publicKey?.toBase58());

  const generateRoast = async () => {
    setLoading(true);
    const balanceUSD = balance! * solPrice!;

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          balanceUSD,
          walletAddress: publicKey?.toBase58(),
        }),
      });

      const data = await response.json();
      console.log(data, "data");
      const generatedRoast = data.roast || data.error;
      setRoast(generatedRoast);

      // Save roast log to Supabase\
      if (data.roast) {
        await fetch("/api/logRoast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            walletAddress: publicKey?.toBase58(),
            solBalance: balance,
            usdValue: balanceUSD,
            roast: generatedRoast,
          }),
        });
      }
    } catch (error) {
      console.error("Error fetching roast:", error);
      setRoast(
        "I tried to roast you, but even AI can't handle your financial situation. 😂"
      );
    }

    setLoading(false);
  };

  return (
    <Card className="w-full h-fit border border-purple-900/50 bg-black/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-white mt-2">Your Wallet</CardTitle>
            <CardDescription className="text-gray-400">
              {connected
                ? "Your wallet is connected. Prepare to be roasted."
                : "Connect your wallet and let us roast your SOL-ely disappointing crypto life choices"}
            </CardDescription>
          </div>
          {connected && <CustomWalletButton />}
        </div>
      </CardHeader>
      <CardContent>
        {!connected && <CustomWalletButton />}

        {connected && balance !== null && solPrice !== null && (
          <div className="border border-purple-900/30 rounded-lg p-4 bg-black/40">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center">
                <div className="bg-purple-900/50 p-1.5 rounded-full mr-3">
                  <Wallet className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <AddressWithCopy address={publicKey} />
                  <div className="flex items-center mt-0.5">
                    <span className="text-xs text-gray-500">Connected now</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end">
                  <Zap className="h-4 w-4 text-purple-400 mr-1" />
                  <span className="text-base font-mono text-purple-400 font-bold">
                    {balance.toFixed(2)} SOL
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ${(balance * solPrice).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="border-t border-purple-900/20 pt-3 mt-3">
              <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 font-bold text-base mb-2">
                WALLET ROAST:
              </h3>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-purple-900/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-purple-900/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-purple-900/50 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-purple-900/50 rounded w-4/5"></div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed">{roast}</p>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-xs text-gray-400">
                    Generated by{" "}
                    <span className="text-purple-400 font-bold">OpenAI</span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-purple-800 bg-black text-purple-400 hover:bg-purple-900/30 hover:text-white cursor-pointer"
                  onClick={generateRoast}
                >
                  Get Another Roast
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-center text-gray-500 flex justify-center">
        <p>
          This app is for entertainment purposes only. No financial advice
          intended.
        </p>
      </CardFooter>
    </Card>
  );
}
