'use client';

import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/functions';
import { useMe } from '@/providers';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { Hex } from 'viem';

export function SendAction({ amount, to }: { amount: string; to: Hex }) {
  const [loading, setLoading] = useState(false);
  const { me, updateBalances } = useMe();
  return (
    <Button
      flat
      className="mx-auto mb-3 w-[90%] bg-black text-white"
      onClick={() => Transaction(me!, amount, 'send', setLoading, updateBalances, undefined, to)}>
      <Send size={22} color="white" strokeWidth={2.5} className="mr-1" />
      {loading ? 'Sending...' : 'Send'}
    </Button>
  );
}
