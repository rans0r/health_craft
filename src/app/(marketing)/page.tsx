import Image from 'next/image';
import dynamic from 'next/dynamic';

const Counter = dynamic(() => import('@/components/counter'), { ssr: false });

export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold">Health Craft</h1>
      <p className="mt-2">Your AI-powered recipe book and meal planner.</p>
      <Image
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&auto=format&fit=crop"
        alt="Assorted healthy foods"
        width={800}
        height={600}
        priority
        className="mt-4 rounded"
      />
      <Counter />
    </main>
  );
}
