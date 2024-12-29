'use client';

import { useMe } from '@/providers';

export default function Home() {
  const { create, me } = useMe();

  const connect = async () => {
    await create('leo');
    const appRedirectUrl = `kuma://home?address=${me?.account}`;
    window.location.href = appRedirectUrl;
  };

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <h1>Hello World</h1>
      <button onClick={connect}>Connect</button>
    </div>
  );
}
