import { X } from 'lucide-react';
import { Anybody } from 'next/font/google';

const anybody = Anybody({ subsets: ['latin'] });

interface NumPadProps {
  handleNumberPress: (value: string) => void;
  className?: string;
}

export function NumPad({ handleNumberPress, className }: NumPadProps) {
  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {/* Row 1: 1-2-3 */}
      <div className="flex flex-row gap-2">
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberPress(num.toString())}
            className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
            <span className={`px-1 text-5xl ${anybody.className} font-bold`}>{num}</span>
          </button>
        ))}
      </div>

      {/* Row 2: 4-5-6 */}
      <div className="flex flex-row gap-2">
        {[4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberPress(num.toString())}
            className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
            <span className={`px-1 text-5xl ${anybody.className} font-bold`}>{num}</span>
          </button>
        ))}
      </div>

      {/* Row 3: 7-8-9 */}
      <div className="flex flex-row gap-2">
        {[7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberPress(num.toString())}
            className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
            <span className={`px-1 text-5xl ${anybody.className} font-bold`}>{num}</span>
          </button>
        ))}
      </div>

      {/* Row 4: .-0-delete */}
      <div className="flex flex-row gap-2">
        <button
          onClick={() => handleNumberPress('.')}
          className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
          <span className={`px-1 text-5xl ${anybody.className} font-bold`}>.</span>
        </button>
        <button
          onClick={() => handleNumberPress('0')}
          className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
          <span className={`px-1 text-5xl ${anybody.className} font-bold`}>0</span>
        </button>
        <button
          onClick={() => handleNumberPress('delete')}
          className="flex h-16 flex-1 items-center justify-center rounded-lg hover:bg-gray-100">
          <X className="h-6 w-6" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
