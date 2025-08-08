'use client';

import * as React from 'react';

export interface UploadDropzoneProps {
  onFiles: (files: FileList) => void;
}

export function UploadDropzone({ onFiles }: UploadDropzoneProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="flex flex-col items-center justify-center rounded border-2 border-dashed p-6 text-center"
    >
      <p className="mb-2 text-sm text-gray-600">
        Drag and drop files here or click to browse
      </p>
      <input type="file" multiple onChange={handleChange} />
    </div>
  );
}

