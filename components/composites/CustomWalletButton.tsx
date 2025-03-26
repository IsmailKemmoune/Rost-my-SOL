"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal, WalletIcon } from "@solana/wallet-adapter-react-ui";
import { Button } from "../ui/button";
import { Wallet } from "lucide-react";

export default function CustomWalletButton() {
  const {
    wallet,
    connect,
    disconnect,
    connected,
    connecting,
    disconnecting,
    publicKey,
  } = useWallet();
  const { setVisible } = useWalletModal();

  console.log(publicKey, "publicKey");

  const handleClick = async () => {
    if (connected) {
      disconnect();
    } else {
      if (!wallet) {
        setVisible(true);
      } else {
        try {
          await connect();
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      }
    }
  };

  return (
    <Button
      disabled={connecting || disconnecting}
      onClick={handleClick}
      size="lg"
      className="relative group bg-gradient-to-r from-purple-600 to-blue-600 
                 hover:from-purple-700 hover:to-blue-700 text-white font-bold 
                 py-3 px-8 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.5)] 
                 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-300 cursor-pointer"
    >
      <span className="mr-2">
        {connected ? (
          <WalletIcon wallet={wallet} className="h-6 w-6" />
        ) : (
          <Wallet className="h-6 w-6" />
        )}
      </span>
      {connecting || disconnecting
        ? "Connecting..."
        : connected
        ? "Disconnect Wallet"
        : "Connect Wallet"}
      <span
        className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 
                       opacity-0 group-hover:opacity-30 transition-opacity blur"
      ></span>
    </Button>
  );
}
