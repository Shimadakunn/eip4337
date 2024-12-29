'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';
import { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  flat?: boolean;
}

export function Button({ children, className, flat = false, ...props }: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <button
      className={cn(
        'relative flex items-center justify-center rounded-xl border-2 px-6 py-3',
        'ease-spring transition-transform duration-150',
        !flat && 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
        !flat && 'active:translate-x-[4px] active:translate-y-[4px]',
        !flat && 'active:shadow-none',
        'text-2xl font-bold',
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      {...props}>
      {children}
    </button>
  );
}
