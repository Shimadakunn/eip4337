import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

import { Chain } from './chain';
import { QRCode } from './qrcode';
import { WalletAddress } from './wallet-address';

export function AddressModal({
  openAddress,
  setOpenAddress,
}: {
  openAddress: boolean;
  setOpenAddress: (open: boolean) => void;
}) {
  return (
    <Drawer open={openAddress} onOpenChange={setOpenAddress}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="h-0 p-0">
          <DrawerTitle className="h-0 p-0"></DrawerTitle>
        </DrawerHeader>
        <div className="relative flex h-full w-full flex-col items-center justify-center">
          <WalletAddress />
          <QRCode />
          <Chain />
        </div>
        <DrawerFooter className="pb-8 pt-2">
          <DrawerClose asChild>
            <Button
              flat
              className="mx-auto flex h-14 w-[90%] items-center justify-center text-xl font-bold"
              onClick={() => setOpenAddress(false)}>
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
