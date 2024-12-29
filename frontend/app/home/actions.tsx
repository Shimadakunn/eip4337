'use client';

import { AddressModal, SendModal } from '@/components/modals';

import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import { useState } from 'react';

export function Actions() {
  const [openAddress, setOpenAddress] = useState(false);

  const [openSend, setOpenSend] = useState(false);

  return (
    <div className="flex h-[15vh] items-start justify-center gap-4 py-2">
      <Button
        flat
        className="flex h-14 w-[35vw] items-center gap-1 p-0 text-lg"
        onClick={() => setOpenSend(true)}>
        Withdr.
        <ArrowUpToLine size={20} color="black" strokeWidth={2.5} />
      </Button>
      <Button
        flat
        className="flex h-14 w-[35vw] items-center gap-1 bg-black p-0 text-lg text-white"
        onClick={() => setOpenAddress(true)}>
        Deposit
        <ArrowDownToLine size={20} color="white" strokeWidth={2.5} />
      </Button>

      {/* DepositModals */}
      <AddressModal openAddress={openAddress} setOpenAddress={setOpenAddress} />

      {/* Withdraw Modals */}
      <SendModal openSend={openSend} setOpenSend={setOpenSend} />
    </div>
  );
}
