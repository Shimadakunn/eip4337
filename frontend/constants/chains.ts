import { Hex } from 'viem';
import { arbitrumSepolia, Chain } from 'viem/chains';

export type ChainType = {
  viem: Chain;
  bundlerRpc: string;
  paymaster: Hex;
  eId: number;
  icon: string;
};

export const chains: {
  [key: string]: ChainType;
} = {
  arbitrum: {
    viem: arbitrumSepolia,
    bundlerRpc: `https://arb-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_BUNDLER_API_KEY}`,
    paymaster: '0x15f5DD9Af65780e6672B8d083E64cAaCC10d0d6A',
    eId: 42161,
    icon: '/tokens-icons/eth.png',
  },
};
