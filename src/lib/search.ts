export type SearchRankingInputs = {
  semanticSimilarity: number; // 0-1 where 1 is most similar
  recencyDays: number; // age of recipe in days
  rating: number; // average rating 0-5
  filterMatchRatio: number; // 0-1 proportion of filters matched
};

const RECENCY_WEIGHT = 0.2;
const RATING_WEIGHT = 0.3;
const FILTER_WEIGHT = 0.2;
const SEMANTIC_WEIGHT = 0.3;

// Compute a weighted search score given relevance factors.
export function computeSearchScore(
  { semanticSimilarity, recencyDays, rating, filterMatchRatio }: SearchRankingInputs,
): number {
  const recencyScore = 1 / (1 + recencyDays); // more recent -> closer to 1
  const ratingScore = rating / 5; // normalize 0-5 rating
  const filterScore = filterMatchRatio; // already normalized 0-1
  const semanticScore = semanticSimilarity; // already normalized 0-1

  return (
    recencyScore * RECENCY_WEIGHT +
    ratingScore * RATING_WEIGHT +
    filterScore * FILTER_WEIGHT +
    semanticScore * SEMANTIC_WEIGHT
  );
}

export const rankingWeights = {
  recency: RECENCY_WEIGHT,
  rating: RATING_WEIGHT,
  filter: FILTER_WEIGHT,
  semantic: SEMANTIC_WEIGHT,
};
