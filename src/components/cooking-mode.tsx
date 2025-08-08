'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useVoiceCommands } from '@/hooks/use-voice-commands';
import { useDeviceCapabilities } from '@/hooks/use-device-capabilities';
import { useTranslations } from 'next-intl';
import { trackEvent } from '@/lib/telemetry.client';

interface CookingModeProps {
  steps: string[];
}

export function CookingMode({ steps }: CookingModeProps) {
  const [index, setIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { voice } = useDeviceCapabilities();
  const t = useTranslations('cook');

  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));

  useVoiceCommands({ onNext: next, onPrevious: prev }, voiceEnabled);

  useEffect(() => {
    trackEvent('cook_mode_start', { steps: steps.length });
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="text-center text-xl min-h-[4rem] flex items-center"
        role="status"
        aria-live="polite"
      >
        {steps[index]}
      </div>
      <div className="flex gap-2">
        <Button onClick={prev} disabled={index === 0}>
          {t('previous')}
        </Button>
        <Button onClick={next} disabled={index === steps.length - 1}>
          {t('next')}
        </Button>
      </div>
      {voice && (
        <Button
          variant="outline"
          onClick={() => setVoiceEnabled((v) => !v)}
          aria-pressed={voiceEnabled}
          aria-label={voiceEnabled ? t('disableVoice') : t('enableVoice')}
        >
          {voiceEnabled ? t('disableVoice') : t('enableVoice')}
        </Button>
      )}
      {voice && voiceEnabled && (
        <p className="text-sm text-gray-500" aria-live="polite">
          {t('voiceHint')}
        </p>
      )}
    </div>
  );
}
