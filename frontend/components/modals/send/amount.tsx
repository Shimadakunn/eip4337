import { tokens } from '@/constants';
import Image from 'next/image';
import { Anybody } from 'next/font/google';

const anybody = Anybody({ subsets: ['latin'] });

export function AmountView({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <div className="my-2 px-5">
      <div className="flex items-center justify-between">
        <div>
          {value ? (
            <p className={`px-1 text-5xl font-bold ${anybody.className}`}>{value}</p>
          ) : (
            <p className={`px-1 text-5xl font-bold ${anybody.className} text-gray-400`}>
              0 {tokens.usdc.coin}
            </p>
          )}
          <p className="px-1 text-sm font-bold text-gray-400">
            Max:{' '}
            <span className={`font-bold ${anybody.className}`}>
              {parseFloat(tokens.usdc.balance!) + parseFloat(tokens.usdc.stakedBalance!)}{' '}
              {tokens.usdc.coin}
            </span>
          </p>
        </div>
        <Image src={tokens.usdc.icon} alt={tokens.usdc.name} width={50} height={50} />
      </div>
      <div className="flex items-center justify-around py-2">
        <button
          className="font-bold text-gray-400"
          onClick={() =>
            onChangeText(
              ((Number(tokens.usdc.balance!) + Number(tokens.usdc.stakedBalance!)) * 0.1).toString()
            )
          }>
          10%
        </button>
        <button
          className="font-bold text-gray-400"
          onClick={() =>
            onChangeText(
              (
                (Number(tokens.usdc.balance!) + Number(tokens.usdc.stakedBalance!)) *
                0.25
              ).toString()
            )
          }>
          25%
        </button>
        <button
          className="font-bold text-gray-400"
          onClick={() =>
            onChangeText(
              ((Number(tokens.usdc.balance!) + Number(tokens.usdc.stakedBalance!)) * 0.5).toString()
            )
          }>
          50%
        </button>
        <button
          className="font-bold text-gray-400"
          onClick={() =>
            onChangeText(
              (
                (Number(tokens.usdc.balance!) + Number(tokens.usdc.stakedBalance!)) *
                0.75
              ).toString()
            )
          }>
          75%
        </button>
        <button
          className="font-bold text-gray-400"
          onClick={() =>
            onChangeText(
              (Number(tokens.usdc.balance!) + Number(tokens.usdc.stakedBalance!)).toString()
            )
          }>
          100%
        </button>
      </div>
    </div>
  );
}
