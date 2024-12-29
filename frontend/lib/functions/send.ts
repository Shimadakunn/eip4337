import { ERC20_ABI, tokens } from '@/constants';
import { encodeFunctionData, Hex, parseEther, parseUnits } from 'viem';
import { Withdraw } from './withdraw';

export function Send(from: Hex, value: bigint, to: string) {
  const send = {
    dest: tokens.usdc.address as Hex,
    value: parseEther('0'),
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to as Hex, value],
    }),
  };

  if (value > parseUnits(tokens.usdc.balance!, 6)) {
    const withdrawValue = value - parseUnits(tokens.usdc.balance!, 6);
    const withdrawCalls = Withdraw(from, withdrawValue);
    return [...withdrawCalls, send];
  }

  return [send];
}
