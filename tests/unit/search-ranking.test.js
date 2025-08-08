import test from 'node:test';
import assert from 'node:assert/strict';
import { computeSearchScore } from '../../src/lib/search.js';

test('search ranking favors recency, rating, filters, and similarity', () => {
  const base = { semanticSimilarity: 0.5, recencyDays: 10, rating: 3, filterMatchRatio: 0.5 };

  const newer = computeSearchScore({ ...base, recencyDays: 1 });
  const older = computeSearchScore({ ...base, recencyDays: 100 });
  assert.ok(newer > older, 'recent recipes should rank higher');

  const betterRated = computeSearchScore({ ...base, rating: 5 });
  const worseRated = computeSearchScore({ ...base, rating: 1 });
  assert.ok(betterRated > worseRated, 'higher rated recipes should rank higher');

  const betterFit = computeSearchScore({ ...base, filterMatchRatio: 1 });
  const worseFit = computeSearchScore({ ...base, filterMatchRatio: 0 });
  assert.ok(betterFit > worseFit, 'recipes matching filters should rank higher');

  const moreSimilar = computeSearchScore({ ...base, semanticSimilarity: 0.9 });
  const lessSimilar = computeSearchScore({ ...base, semanticSimilarity: 0.1 });
  assert.ok(moreSimilar > lessSimilar, 'semantically similar recipes should rank higher');
});
