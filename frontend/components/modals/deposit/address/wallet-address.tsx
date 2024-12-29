import { useToast } from '@/hooks/use-toast';
import { useMe } from '@/providers';
import { Copy } from 'lucide-react';

export function WalletAddress() {
  const { toast } = useToast();
  const { me } = useMe();
  const walletAddress = me?.account;

  const handleCopy = async () => {
    try {
      navigator.clipboard.writeText(walletAddress!);
      console.log('Copied to clipboard');
      toast({
        title: 'Copied to clipboard',
      });
    } catch (err) {
      toast({
        title: 'Failed to copy',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <h2 className="font-lexend text-center text-xl font-bold">Wallet Address</h2>
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="font-lexend text-center text-lg font-bold text-gray-500">
          {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-6)}
        </span>
        <button onClick={handleCopy} className="transition-opacity hover:opacity-80">
          <Copy size={15} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
}
