import Lottie from 'lottie-react';
import Image from 'next/image';
import { Actions } from './actions';
export default function Home() {
  return (
    <div className="flex h-[100vh] w-full flex-col items-center justify-center">
      <div className="flex h-[10vh] items-center justify-center gap-2">
        <Image src="/logo.png" alt="logo" width={35} height={35} />
        <h1 className="text-4xl font-black">booklet</h1>
      </div>
      <video width="500" height="240" autoPlay muted loop playsInline>
        <source src="/shine.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
      <Actions />
    </div>
  );
}
