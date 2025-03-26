import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { PublicKey } from "@solana/web3.js";
import { truncateAddress } from "@/utils/truncateAddress";

interface AddressWithCopyProps {
  address: PublicKey | string | null;
}

export const AddressWithCopy = ({ address }: AddressWithCopyProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!address) return;

    const addressString =
      typeof address === "string" ? address : address.toBase58();
    navigator.clipboard
      .writeText(addressString)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err: Error) => {
        console.error("Failed to copy address: ", err);
      });
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-mono text-purple-400">
        {truncateAddress(address)}
      </span>
      {address && (
        <button
          className="ml-1 text-gray-600 hover:text-purple-400 transition-colors cursor-pointer"
          onClick={copyToClipboard}
          disabled={!address}
          aria-label="Copy address"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
};
