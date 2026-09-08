import {Request, Response, NextFunction} from "express";

const buckets = new Map<string, {startedAt: number; count: number}>();
const WINDOW_MS = 60 * 1000;
const MAX_EVENTS_PER_WINDOW = 300;

export default function analyticsRateLimit(req: Request, res: Response, next: NextFunction) {
  const tenant = String(req.headers["x-tenant"] || req.headers.host || "unknown");
  const key = `${tenant}:${req.ip}`;
  const now = Date.now();
  const current = buckets.get(key);
  const bucket = !current || now - current.startedAt >= WINDOW_MS ? {startedAt: now, count: 0} : current;
  bucket.count += 1;
  buckets.set(key, bucket);
  if (bucket.count > MAX_EVENTS_PER_WINDOW) return res.status(202).json({status: "accepted", throttled: true});
  return next();
}
