'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { useDeviceCapabilities } from '@/hooks/use-device-capabilities';

interface CookingModeProps {
  steps: string[];
}

export function CookingMode({ steps }: CookingModeProps) {
  const [index, setIndex] = useState(0);
  const { voice } = useDeviceCapabilities();

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  useVoiceCommands({ onNext: next, onPrevious: prev });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center text-xl min-h-[4rem] flex items-center">{steps[index]}</div>
      <div className="flex gap-2">
        <Button onClick={prev} disabled={index === 0}>
          Previous
        </Button>
        <Button onClick={next} disabled={index === steps.length - 1}>
          Next
        </Button>
      </div>
      {voice && (
        <p className="text-sm text-gray-500">Voice commands enabled: say "next" or "previous".</p>
      )}
    </div>
  );
}
