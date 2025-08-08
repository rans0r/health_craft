import { CookingMode } from '@/components/cooking-mode';

const steps = [
  'Gather ingredients.',
  'Preheat the oven to 180°C.',
  'Mix ingredients.',
  'Bake for 20 minutes.'
];

export default function SampleCookPage() {
  return (
    <main className="p-4 sm:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cooking Mode</h1>
      <CookingMode steps={steps} />
    </main>
  );
}
