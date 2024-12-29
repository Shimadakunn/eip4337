import type { Metadata, Viewport } from 'next';

import { SmartWalletProvider } from '@/lib/smart-wallet/SmartWalletProvider';
import { MeProvider } from '@/providers';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({ subsets: ['latin'] });
const inter = Inter({ subsets: ['latin'] });
const APP_NAME = 'booklet';
const APP_DEFAULT_TITLE = 'booklet';
const APP_TITLE_TEMPLATE = '%s - booklet';
const APP_DESCRIPTION = 'High yield for your assets';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MeProvider>
          <SmartWalletProvider>{children}</SmartWalletProvider>
        </MeProvider>
      </body>
    </html>
  );
}
