'use client';

import { useMe } from '@/providers';
import { formatBalance } from '@/utils';

export function Balance() {
  const { balances } = useMe();

  const totalBalance = parseFloat(balances.balance) + parseFloat(balances.stakedBalance);

  return (
    <div className="flex h-[20vh] w-auto items-center justify-center">
      <h1 className="px-2 text-7xl font-black ">
        ${balances.balance ? formatBalance(totalBalance) : 'NOT LOADED'}
      </h1>
    </div>
  );
}
