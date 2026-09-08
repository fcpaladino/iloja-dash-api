const recommendationCache = new Map<string, {expiresAt: number; products: any[]}>();
export const RECOMMENDATION_CACHE_TTL_MS = 5 * 60 * 1000;
export const recommendationCacheStore = recommendationCache;
export function invalidateRecommendationCache(companyId: number, visitorId?: string) {
  const prefix = visitorId ? `${companyId}:${visitorId}` : `${companyId}:`;
  for (const key of recommendationCache.keys()) if (key.startsWith(prefix)) recommendationCache.delete(key);
}
