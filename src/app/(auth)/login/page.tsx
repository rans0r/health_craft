'use client';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => signIn('credentials')}
      >
        Sign in with Credentials
      </button>
    </main>
  );
}
