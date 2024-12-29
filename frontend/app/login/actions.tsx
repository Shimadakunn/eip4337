'use client';

import { Button } from '@/components/ui/button';
import { useMe } from '@/providers';
import { ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Actions() {
  const [creating, setCreating] = useState(false);
  const { me, create, get } = useMe();
  return (
    <div className="flex h-[10vh] w-full flex-row items-start justify-center ">
      {creating ? (
        <>
          <Button
            className="flex items-center justify-center gap-1 pl-2 pr-3 text-base font-bold"
            onClick={() => setCreating(false)}
            flat>
            <ChevronLeft size={24} color="black" />
            Back
          </Button>
          <Button
            flat
            className="ml-2 flex w-[60vw] items-center justify-center gap-1 bg-black text-base text-white"
            onClick={async () => {
              await create('booklet');
            }}>
            Create
            <Sparkles size={20} color="white" />
          </Button>
        </>
      ) : (
        <>
          <Button
            flat
            className="flex items-center justify-center gap-1  text-base font-bold "
            onClick={async () => {
              await get();
            }}>
            Connect
          </Button>
          <Button
            flat
            className="ml-2 flex w-[60vw] items-center justify-center gap-2 bg-black text-base font-bold text-white"
            onClick={() => setCreating(true)}>
            Get started
            <ArrowRight size={20} color="white" />
          </Button>
        </>
      )}
    </div>
  );
}
