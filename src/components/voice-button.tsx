'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';

export interface VoiceButtonProps {
  onToggle?: (listening: boolean) => void;
}

export function VoiceButton({ onToggle }: VoiceButtonProps) {
  const [listening, setListening] = React.useState(false);

  const toggle = () => {
    const next = !listening;
    setListening(next);
    onToggle?.(next);
  };

  return <Button onClick={toggle}>{listening ? 'Stop' : 'Speak'}</Button>;
}

