import { createPublicClient, formatUnits, Hex, http } from 'viem';

import { chains, ERC20_ABI, tokens } from '@/constants';

const API_BASE_URL = `https://min-api.cryptocompare.com`;

export const fetch = async (address: Hex) => {
  const client = createPublicClient({
    chain: chains.arbitrum.viem,
    transport: http(),
  });

  const [balance, stakedBalance] = await Promise.all([
    // axios.get(
    //   `${API_BASE_URL}/data/price?fsym=${tokens.usdc.coin}&tsyms=USD&api_key=${process.env.NEXT_PUBLIC_PRICE_API_KEY}`
    // ),
    client.readContract({
      address: tokens.usdc.address as Hex,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    }),
    client.readContract({
      address: tokens.usdc.stakedTokenAddress as Hex,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [address],
    }),
  ]);

  const formattedBalance = formatUnits(balance as bigint, 6);
  const formattedStakedBalance = formatUnits(stakedBalance as bigint, 6);

  // Update tokens object
  tokens.usdc.balance = formattedBalance;
  tokens.usdc.stakedBalance = formattedStakedBalance;
  console.log('tokens.usdc', tokens.usdc);

  return {
    balance: formattedBalance,
    stakedBalance: formattedStakedBalance,
  };
};
