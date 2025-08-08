import * as React from 'react';

export interface DeviceActionBarProps {
  children: React.ReactNode;
}

export function DeviceActionBar({ children }: DeviceActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white p-2">
      {children}
    </div>
  );
}

