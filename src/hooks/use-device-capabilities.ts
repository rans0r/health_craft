'use client';

import { useEffect, useState } from 'react';

export type DeviceCapabilities = {
  touch: boolean;
  voice: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
};

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    touch: false,
    voice: false,
    deviceType: 'desktop',
  });

  useEffect(() => {
    const width = window.innerWidth;
    const deviceType = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const voice = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setCapabilities({ touch, voice, deviceType });
  }, []);

  return capabilities;
}
