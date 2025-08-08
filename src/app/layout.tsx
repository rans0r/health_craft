import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Health Craft',
  description: 'AI-powered recipe book and meal planner',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
