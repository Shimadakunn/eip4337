import { Address, Hex, createPublicClient, http, toHex } from "viem";

import { FACTORY_ABI, FACTORY_ADDRESS, chains } from "@/constants";

export type User = { id: Hex; pubKey: { x: Hex; y: Hex }; account: Address };

export async function getUser(id: Hex): Promise<User> {
  const firstChain = Object.keys(chains)[0];
  const client = createPublicClient({
    chain: chains[firstChain].viem,
    transport: http(),
  });
  const user = await client.readContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "getUser",
    args: [BigInt(id)],
  });
  console.log("user", user.id, user.publicKey, user.account);
  return {
    id: toHex(user.id),
    pubKey: {
      x: user.publicKey[0],
      y: user.publicKey[1],
    },
    account: user.account,
  };
}
