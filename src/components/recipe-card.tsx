import * as React from 'react';
import { TagChip } from '@/components/tag-chip';

export interface RecipeCardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  tags?: string[];
}

export function RecipeCard({ title, description, imageUrl, tags = [] }: RecipeCardProps) {
  return (
    <div className="overflow-hidden rounded border bg-white">
      {imageUrl && <img src={imageUrl} alt={title} className="h-40 w-full object-cover" />}
      <div className="p-4">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        {description && <p className="mb-2 text-sm text-gray-700">{description}</p>}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

