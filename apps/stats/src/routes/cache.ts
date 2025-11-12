import { Hono } from "hono";

import { clearCache, getCacheStatus } from "../services/cache.js";

export const cacheRoutes = new Hono();

// Cache management endpoint (development only)
cacheRoutes.delete("/", (c) => {
  if (process.env.NODE_ENV !== "development") {
    return c.json(
      { error: "Cache management only available in development" },
      403,
    );
  }

  const clearedCount = clearCache();
  return c.json({
    message: "Cache cleared",
    clearedEntries: clearedCount,
  });
});

cacheRoutes.get("/status", (c) => {
  if (process.env.NODE_ENV !== "development") {
    return c.json({ error: "Cache status only available in development" }, 403);
  }

  const status = getCacheStatus();
  return c.json(status);
});
