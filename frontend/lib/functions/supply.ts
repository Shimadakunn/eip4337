import { AAVE_IPOOL_ABI, ERC20_ABI, protocols, tokens } from '@/constants';
import { encodeFunctionData, Hex, parseUnits } from 'viem';

export function Supply(from: Hex, value: bigint) {
  const approve = {
    dest: tokens.usdc.address as Hex,
    value: parseUnits('0', 6),
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [protocols.aave.ipoolAddress as Hex, value],
    }),
  };
  const supply = {
    dest: protocols.aave.ipoolAddress as Hex,
    value: parseUnits('0', 6),
    data: encodeFunctionData({
      abi: AAVE_IPOOL_ABI,
      functionName: 'supply',
      args: [tokens.usdc.address as Hex, value, from, 0],
    }),
  };

  return [approve, supply];
}
