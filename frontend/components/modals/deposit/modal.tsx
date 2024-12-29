import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { CreditCard, QrCode } from 'lucide-react';

export function Deposit({
  openDeposit,
  setOpenDeposit,
  setOpenAddress,
  setOpenOnramp,
}: {
  openDeposit: boolean;
  setOpenDeposit: (open: boolean) => void;
  setOpenAddress: (open: boolean) => void;
  setOpenOnramp: (open: boolean) => void;
}) {
  return (
    <Drawer open={openDeposit} onOpenChange={setOpenDeposit}>
      <DrawerContent className="bottom-4 mx-auto flex w-[95vw] rounded-3xl px-6">
        <DrawerHeader className="py-2">
          <DrawerTitle className="text-2xl font-bold">Deposit</DrawerTitle>
        </DrawerHeader>
        <Button
          flat
          className="mx-auto mb-3 flex h-14 w-full items-center justify-center text-lg font-bold"
          onClick={() => {
            setOpenAddress(true);
            setOpenDeposit(false);
          }}>
          <QrCode size={20} color="black" strokeWidth={2.5} className="mr-1" />
          Display Address
        </Button>
        <Button
          flat
          className="mx-auto mb-8 flex h-14 w-full items-center justify-center bg-black text-lg font-bold text-white"
          onClick={() => {
            setOpenOnramp(true);
            setOpenDeposit(false);
          }}>
          <CreditCard size={20} color="white" strokeWidth={3} className="mr-2" />
          Deposit with Card
        </Button>
      </DrawerContent>
    </Drawer>
  );
}
