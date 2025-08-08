const RECENCY_WEIGHT = 0.2;
const RATING_WEIGHT = 0.3;
const FILTER_WEIGHT = 0.2;
const SEMANTIC_WEIGHT = 0.3;

function computeSearchScore({ semanticSimilarity, recencyDays, rating, filterMatchRatio }) {
  const recencyScore = 1 / (1 + recencyDays);
  const ratingScore = rating / 5;
  const filterScore = filterMatchRatio;
  const semanticScore = semanticSimilarity;
  return (
    recencyScore * RECENCY_WEIGHT +
    ratingScore * RATING_WEIGHT +
    filterScore * FILTER_WEIGHT +
    semanticScore * SEMANTIC_WEIGHT
  );
}

const rankingWeights = {
  recency: RECENCY_WEIGHT,
  rating: RATING_WEIGHT,
  filter: FILTER_WEIGHT,
  semantic: SEMANTIC_WEIGHT,
};

export { computeSearchScore, rankingWeights };
