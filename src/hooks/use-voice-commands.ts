'use client';

import { useEffect } from 'react';

interface VoiceCommandHandlers {
  onNext?: () => void;
  onPrevious?: () => void;
}

export function useVoiceCommands(
  handlers: VoiceCommandHandlers,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();
      if (transcript.includes('next')) handlers.onNext?.();
      if (transcript.includes('previous') || transcript.includes('back'))
        handlers.onPrevious?.();
    };

    recognition.start();
    return () => recognition.stop();
  }, [handlers, enabled]);
}
