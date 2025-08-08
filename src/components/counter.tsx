'use client';

import { useCounter } from '@/lib/store';
import { Button } from '@/components/ui/button';

export function Counter() {
  const { count, increment } = useCounter();
  return (
    <div className="mt-4">
      <p>Count: {count}</p>
      <Button onClick={increment}>Increment</Button>
    </div>
  );
}
