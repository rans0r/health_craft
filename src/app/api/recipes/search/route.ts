import { prisma } from '@/lib/prisma';
import { createEmbedding } from '@/lib/embedding';
import { computeSearchScore } from '@/lib/search';

// Search recipes with ranking across recency, rating, filter fit, and semantic similarity.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const tags = searchParams.getAll('tag');
  const useSemantic = searchParams.get('semantic') === 'true';

  let embedding: Buffer | null = null;
  if (useSemantic && q) {
    embedding = await createEmbedding(q);
    if (!embedding) {
      return Response.json({ recipes: [] });
    }
  }

  const params: any[] = [];
  let idx = 1;

  let semanticSelect = '0 as semantic_similarity';
  if (embedding) {
    semanticSelect = `1 / (1 + (r.embedding <-> $${idx})) as semantic_similarity`;
    params.push(embedding);
    idx++;
  }

  params.push(tags);
  const filterSelect = `(SELECT COUNT(*) FROM UNNEST($${idx}::text[]) t WHERE t = ANY(r.tags))::float AS filter_matches, array_length($${idx}::text[],1) as filter_count`;
  idx++;

  let where = '';
  if (q && !embedding) {
    where = `WHERE (r.title ILIKE '%' || $${idx} || '%' OR r.description ILIKE '%' || $${idx} || '%')`;
    params.push(q);
    idx++;
  }

  const query = `
    SELECT r.id, r.title, r.description, r.tags, r.createdAt,
           COALESCE(avg_r.avg_rating, 0) as avg_rating,
           ${semanticSelect},
           ${filterSelect}
    FROM "Recipe" r
    LEFT JOIN (
      SELECT "recipeId", AVG(rating) as avg_rating
      FROM "RecipeRating"
      GROUP BY "recipeId"
    ) avg_r ON avg_r."recipeId" = r.id
    ${where}
  `;

  const rows = (await prisma.$queryRawUnsafe(query, ...params)) as any[];

  const recipes = rows
    .map((r) => {
      const recencyDays = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const filterRatio = r.filter_count ? r.filter_matches / r.filter_count : 1;
      const score = computeSearchScore({
        semanticSimilarity: r.semantic_similarity || 0,
        recencyDays,
        rating: r.avg_rating || 0,
        filterMatchRatio: filterRatio,
      });
      return {
        id: r.id,
        title: r.title,
        description: r.description,
        tags: r.tags,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return Response.json({ recipes });
}
