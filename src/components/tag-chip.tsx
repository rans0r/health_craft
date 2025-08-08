import * as React from 'react';

export interface TagChipProps {
  tag: string;
}

export function TagChip({ tag }: TagChipProps) {
  return (
    <span className="inline-block rounded bg-gray-200 px-2 py-1 text-xs text-gray-700">
      {tag}
    </span>
  );
}

