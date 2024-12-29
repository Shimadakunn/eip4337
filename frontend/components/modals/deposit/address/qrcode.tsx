import { useMe } from '@/providers';
import { QrCode } from 'react-qrcode-pretty';

export const QRCode = () => {
  const { me } = useMe();
  return (
    <QrCode
      value={me!.account!}
      image={'/logo.png'}
      level="L"
      variant={{
        eyes: 'fluid',
        body: 'rounded',
      }}
      color={{
        eyes: '#000',
        body: '#000',
      }}
      padding={0}
      margin={0}
      bgColor="#fff"
      bgRounded
      divider
    />
  );
};
