import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'PALJA Oracle - Your Fortune Awaits',
  description: 'Ancient Korean fortune-telling, powered by AI, verified on-chain. It\'s not alpha. It\'s PALJA.',
  openGraph: {
    title: 'PALJA Oracle - 福福福福',
    description: 'It\'s not alpha. It\'s PALJA.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PALJA Oracle - 福福福福',
    description: 'It\'s not alpha. It\'s PALJA.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="talisman-bg" />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
