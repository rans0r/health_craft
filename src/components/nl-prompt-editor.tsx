import * as React from 'react';

export interface NLPromptEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function NLPromptEditor({ className = '', ...props }: NLPromptEditorProps) {
  return (
    <textarea
      className={`w-full border px-2 py-1 ${className}`}
      rows={4}
      {...props}
    />
  );
}

