import * as React from 'react';

export interface PlanGridProps {
  slots: React.ReactNode[];
  columns?: number;
}

export function PlanGrid({ slots, columns = 7 }: PlanGridProps) {
  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {slots.map((slot, idx) => (
        <div key={idx} className="border p-2">
          {slot}
        </div>
      ))}
    </div>
  );
}

