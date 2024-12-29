import { useToast } from '@/hooks/use-toast';
import { ClipboardIcon, EraserIcon, ScanIcon } from 'lucide-react';
import { useState } from 'react';
import { ScanModal } from '../scan';
export function AddressInput({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  const [showScan, setShowScan] = useState(false);
  const { toast } = useToast();
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith('0x')) {
        onChangeText(text);
      } else {
        console.log('invalid');
        toast({
          title: 'Invalid address',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to access clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="my-2 flex w-full flex-row items-center justify-between rounded-lg px-5">
      {value ? (
        <div className="flex flex-col items-start justify-between">
          <span className="truncate text-5xl font-bold">
            {value.slice(0, 4)}...{value.slice(-3)}
          </span>
        </div>
      ) : (
        <span className="text-5xl font-bold text-gray-400">0x...</span>
      )}
      <div className="mr-2 flex flex-row items-center justify-center gap-2">
        <button onClick={() => onChangeText('')} className="transition-opacity hover:opacity-80">
          <EraserIcon className="h-5 w-5 stroke-[3] text-red-500" />
        </button>

        <button onClick={handlePaste} className="transition-opacity hover:opacity-80">
          <ClipboardIcon className="h-5 w-5 stroke-[3] text-black" />
        </button>

        <button onClick={() => setShowScan(true)} className="transition-opacity hover:opacity-80">
          <ScanIcon className="h-5 w-5 stroke-[3] text-black" />
        </button>
      </div>
      <ScanModal openScan={showScan} setOpenScan={setShowScan} />
    </div>
  );
}
