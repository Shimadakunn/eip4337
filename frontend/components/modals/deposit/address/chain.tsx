import { tokens } from '@/constants';
import Image from 'next/image';

export function Chain() {
  return (
    <div className="mt-6 flex items-center justify-center gap-1 rounded-xl bg-gray-200 px-4 py-2">
      <Image src={tokens.usdc.icon} alt="USDC icon" width={20} height={20} />
      <span className="text-center font-bold text-gray-700">on Arbitrum Sepolia</span>
    </div>
  );
}
