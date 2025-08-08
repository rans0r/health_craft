import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';

export const metadata = {
  title: 'Health Craft',
  description: 'AI-powered recipe book and meal planner',
  manifest: '/manifest.json',
  themeColor: '#1e90ff',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e90ff" />
      </head>
      <body className="min-h-screen bg-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
