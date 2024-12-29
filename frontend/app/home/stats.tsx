'use client';

import { Transaction } from '@/lib/functions';
import { useMe } from '@/providers';
import { formatBalance } from '@/utils';
import { useState } from 'react';

export function Infos() {
  const [isLoading, setIsLoading] = useState(false);
  const { me, balances, updateBalances } = useMe();
  return (
    <>
      <div className="flex w-full items-center justify-around gap-4">
        <button
          className="rounded-md border border-gray-500 px-4 py-2 text-black"
          onClick={() => Transaction(me!, '1.5', 'withdraw', setIsLoading, updateBalances)}>
          {isLoading ? 'Withdrawing...' : 'Withdraw'}
        </button>
        <button
          className="rounded-md border border-gray-500 px-4 py-2 text-black"
          onClick={() => Transaction(me!, '1.5', 'supply', setIsLoading, updateBalances)}>
          {isLoading ? 'Supplying...' : 'Supply'}
        </button>
      </div>
      <div className="flex w-full items-center justify-around gap-4">
        <div className="flex flex-col items-start justify-center">
          balance {balances.balance ? formatBalance(balances.balance, 2) : 'NOT LOADED'}
        </div>
        <div className="flex flex-col items-start justify-center">
          staked balance{' '}
          {balances.stakedBalance ? formatBalance(balances.stakedBalance, 2) : 'NOT LOADED'}
        </div>
      </div>
    </>
  );
}
