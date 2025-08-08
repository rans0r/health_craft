'use client';

import Link from 'next/link';
import { useDeviceCapabilities } from '@/hooks/use-device-capabilities';

export default function RecipesPage() {
  const { deviceType } = useDeviceCapabilities();
  const padding = deviceType === 'desktop' ? 'p-8' : 'p-4';
  return (
    <main className={`${padding} max-w-2xl mx-auto`}> 
      <h1 className="text-2xl font-bold">Recipes</h1>
      <p className="mt-2">Manage your personal recipe collection.</p>
      <p className="mt-4 text-sm text-gray-500">Viewing on: {deviceType}</p>
      <Link href="/recipes/sample/cook" className="mt-4 inline-block text-blue-600 underline">
        Try cooking mode
      </Link>
    </main>
  );
}
