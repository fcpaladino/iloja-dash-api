const WINDOW_MS = 60 * 60 * 1000;
const MAX_ANALYSES = Number(process.env.AI_PRODUCT_ANALYSIS_PER_HOUR || 20);
const counters = new Map<string, {count: number; resetAt: number}>();

export function assertProductAIAnalysisRateLimit(companyId: number, userId: number) {
  const now = Date.now();
  const key = `${companyId}:${userId}`;
  const current = counters.get(key);
  if (!current || current.resetAt <= now) { counters.set(key, {count: 1, resetAt: now + WINDOW_MS}); return; }
  if (current.count >= MAX_ANALYSES) throw new AppError("Limite temporário de análises atingido. Tente novamente mais tarde.", 429);
  current.count += 1;
}
import AppError from "../../errors/AppError";
