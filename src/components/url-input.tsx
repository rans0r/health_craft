import * as React from 'react';

export interface URLInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function URLInput({ className = '', ...props }: URLInputProps) {
  return (
    <input
      type="url"
      className={`w-full border px-2 py-1 ${className}`}
      {...props}
    />
  );
}

