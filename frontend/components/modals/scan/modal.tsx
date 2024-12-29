import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useState } from 'react';
import { toast } from 'sonner';
import { QRScanner } from './qr-scanner';
export function ScanModal({
  openScan,
  setOpenScan,
}: {
  openScan: boolean;
  setOpenScan: (open: boolean) => void;
}) {
  const [data, setData] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result?.text.startsWith('0x')) {
      setData(result?.text);
      console.log(result.text);
      setOpenScan(false);
    } else {
      toast.error('Invalid address');
    }
  };

  return (
    <Drawer open={openScan} onOpenChange={setOpenScan}>
      <DrawerContent className="h-[90vh]">
        <DrawerHeader className="py-1">
          <DrawerTitle className="p-0"></DrawerTitle>
        </DrawerHeader>
        <QRScanner onScan={handleScan} />
      </DrawerContent>
    </Drawer>
  );
}
