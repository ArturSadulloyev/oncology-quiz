import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Oncology Quiz',
  description: 'Onkologiya boʻyicha tibbiy imtihon amaliyoti va test sinovlari',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Oncology Quiz',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#F2F2F7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased bg-[#F2F2F7] text-[#1C1C1E] min-h-screen selection:bg-blue-100">
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative shadow-2xl bg-[#F2F2F7]">
          {children}
        </div>
      </body>
    </html>
  );
}
