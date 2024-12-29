import { Scanner } from '@yudiel/react-qr-scanner';

export function QRScanner({ onScan }: { onScan: (result: any) => void }) {
  return (
    <div className="flex h-screen w-full flex-col items-center bg-black px-4">
      {/* Scanner View */}
      <div className="absolute top-1/2 z-10 aspect-square w-[60%] max-w-sm -translate-y-1/2">
        {/* Scanner Frame */}
        <div className="absolute inset-0 z-10 rounded-3xl">
          {/* Scanning Area */}
          <div className="h-full w-full rounded-3xl">
            {/* Corner Markers */}
            <div className="absolute left-0 top-0 h-12 w-12 rounded-tl-3xl border-l-4 border-t-4 border-white" />
            <div className="absolute right-0 top-0 h-12 w-12 rounded-tr-3xl border-r-4 border-t-4 border-white" />
            <div className="absolute bottom-0 left-0 h-12 w-12 rounded-bl-3xl border-b-4 border-l-4 border-white" />
            <div className="absolute bottom-0 right-0 h-12 w-12 rounded-br-3xl border-b-4 border-r-4 border-white" />
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 py-12">
        <Scanner
          onScan={onScan}
          components={{
            finder: false,
          }}
        />

        <div className="absolute top-6 z-20 h-20 w-[120%]  bg-gradient-to-b from-black to-transparent backdrop-blur-sm" />
        <div className="absolute bottom-6 z-20 h-20 w-[120%] bg-gradient-to-b from-transparent to-black backdrop-blur-sm" />
      </div>
    </div>
  );
}
