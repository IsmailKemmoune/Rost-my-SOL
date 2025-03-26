"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import useSWR from "swr";
import { Button } from "../ui/button";
import { Lock, Unlock, Wallet } from "lucide-react";
import { AddressWithCopy } from "./AddressWithCopy";
import { formatDate } from "@/utils/formatDate";

interface Roast {
  id: string;
  wallet_address: string;
  sol_balance: number;
  usd_value: number;
  roast: string;
  created_at: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function RoastLogs() {
  const [isAnimating, setIsAnimating] = useState(false);

  const { data, error, isLoading } = useSWR("/api/getLogs", fetcher, {
    refreshInterval: 10000, // Auto-refresh logs every 10 seconds
  });
  const [showAllRoasts, setShowAllRoasts] = useState(false);

  if (error)
    return <p className="text-center text-red-500">Failed to load logs</p>;

  const logs = data?.data || [];

  const toggleRoasts = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setShowAllRoasts(!showAllRoasts);
      setTimeout(() => {
        setIsAnimating(false);
      }, 600);
    }, 600);
  };

  return (
    <Card className="w-full h-fit border border-purple-900/50 bg-black/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Recent Roasts</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleRoasts}
            disabled={isAnimating}
            className="text-xs border-purple-800 bg-black text-purple-400 hover:bg-purple-900/30 hover:text-white cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-800 to-pink-800 opacity-0 group-hover:opacity-20 transition-opacity"></span>
            <span className="relative z-10 flex items-center">
              {showAllRoasts ? (
                <Lock className="h-4 w-4 mr-1" />
              ) : (
                <Unlock className="h-4 w-4 mr-1" />
              )}
              {showAllRoasts ? "Encrypt" : "Decrypt"}
            </span>
          </Button>
        </div>
        <CardDescription className="text-gray-400">
          See how other wallets got destroyed
        </CardDescription>
      </CardHeader>

      <CardContent className="relative pt-0 max-h-[700px] overflow-y-auto custom-scrollbar">
        {/* Content container */}
        <div className="min-h-[300px] relative">
          {/* Animated content */}
          <div
            className={`space-y-4 transition-all duration-500 ${
              isAnimating ? "animate-cyber-hide" : ""
            } ${!showAllRoasts && !isAnimating ? "hidden" : ""}`}
          >
            <div className="space-y-4">
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div
                      key={index}
                      className="border border-purple-900/30 rounded-lg p-4 bg-black/40 animate-pulse"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="bg-purple-900/50 p-1.5 rounded-full mr-3">
                            <Wallet className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <div className="h-4 w-24 bg-purple-900/50 rounded" />
                            <div className="h-3 w-16 bg-purple-900/50 rounded mt-2" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-16 bg-purple-900/50 rounded" />
                          <div className="h-3 w-12 bg-purple-900/50 rounded mt-2" />
                        </div>
                      </div>
                      <div className="h-4 w-full bg-purple-900/50 rounded mt-2" />
                    </div>
                  ))
                : logs.map((roast: Roast) => (
                    <div
                      key={roast.id}
                      className="border border-purple-900/30 rounded-lg p-4 bg-black/40 hover:bg-black/60 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div className="bg-purple-900/50 p-1.5 rounded-full mr-3">
                            <Wallet className="h-4 w-4 text-purple-400" />
                          </div>
                          <div>
                            <AddressWithCopy address={roast.wallet_address} />
                            <div className="flex items-center mt-0.5">
                              <span className="text-xs text-gray-500">
                                {formatDate(roast.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-mono text-purple-400 font-bold">
                            {roast.sol_balance} SOL
                          </div>
                          <div className="text-xs text-gray-500">
                            ${roast.usd_value.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 mt-2 border-t border-purple-900/20 pt-2">
                        `&quot;{roast.roast}`&quot;
                      </p>
                    </div>
                  ))}
            </div>
          </div>

          {/* Encrypted state */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isAnimating ? "animate-cyber-show" : ""
            } ${showAllRoasts && !isAnimating ? "hidden" : ""}`}
          >
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="w-20 h-20 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-50 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-black rounded-full border-2 border-purple-500">
                  <Lock className="h-10 w-10 text-purple-400" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
                DATA ENCRYPTED
              </h3>
              <p className="text-gray-400 max-w-xs mb-7">
                Access to recent roasts has been secured. Decrypt to view wallet
                roasts.
              </p>
              <div className="w-full max-w-xs h-4 bg-black/40 border border-purple-900/30 rounded-full overflow-hidden mb-2">
                <div className="h-full w-full bg-gradient-to-r from-purple-600 to-pink-600 encrypted-progress"></div>
              </div>
            </div>
          </div>

          {/* Animation overlay */}
          {isAnimating && (
            <div className="absolute inset-0 pointer-events-none z-10">
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 
  bg-gradient-to-b from-transparent via-purple-400/20 to-transparent 
  [background-size:100%_8px] animate-scanline"
              ></div>
              <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-9 
  [background-image:linear-gradient(90deg,transparent_95%,rgba(236,72,153,0.3)_95%),linear-gradient(0deg,transparent_97%,rgba(168,85,247,0.3)_97%)] 
  [background-size:20px_20px] animate-glitch-blocks"
              ></div>
            </div>
          )}
        </div>
      </CardContent>
      {showAllRoasts && (
        <div className="absolute bottom-14 left-0 right-0 h-50 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      )}

      <CardFooter className="text-xs text-center text-gray-500 flex justify-center mt-auto">
        <p>
          Roasts are generated by AI and do not reflect real financial advice.
        </p>
      </CardFooter>
    </Card>
  );
}
