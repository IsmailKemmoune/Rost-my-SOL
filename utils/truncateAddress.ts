import { PublicKey } from "@solana/web3.js";

export const truncateAddress = (addr: string | PublicKey | null) => {
  if (!addr) return "No address";

  const addressString = typeof addr === "string" ? addr : addr.toBase58();
  return addressString.length > 10
    ? `${addressString.slice(0, 4)}...${addressString.slice(-4)}`
    : addressString;
};
