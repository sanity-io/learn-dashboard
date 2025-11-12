import { Hono } from "hono";
import { getCacheStatus } from "../services/cache.js";

export const healthRoutes = new Hono();

// Health check endpoint
healthRoutes.get("/", (c) => {
  const cacheStatus = getCacheStatus();

  return c.json({
    status: "ok",
    message: "Analytics API proxy server running",
    timestamp: new Date().toISOString(),
    cache: {
      duration: cacheStatus.cacheDuration,
      entries: cacheStatus.totalEntries,
      environment: process.env.NODE_ENV || "development",
    },
  });
});
