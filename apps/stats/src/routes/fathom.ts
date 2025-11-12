import { Hono } from "hono";

import {
  getCacheEntry,
  getCachedResponse,
  setCachedResponse,
} from "../services/cache.js";

export const fathomRoutes = new Hono();

// Get Fathom site stats
fathomRoutes.post("/stats/:siteId", async (c) => {
  const siteId = c.req.param("siteId");
  const apiKey = process.env.FATHOM_ANALYTICS_API;

  if (!siteId) {
    return c.json({ error: "Site ID required" }, 400);
  } else if (!apiKey) {
    return c.json({ error: "API key required" }, 401);
  }

  // Check cache first
  const cachedData = getCachedResponse("fathom", siteId);
  if (cachedData) {
    // Add cache headers
    const cacheEntry = getCacheEntry("fathom", siteId);
    c.header("X-Cache", "HIT");
    c.header(
      "X-Cache-Age",
      Math.floor((Date.now() - (cacheEntry?.timestamp || 0)) / 1000).toString(),
    );
    c.header(
      "X-Cache-Expires",
      new Date(cacheEntry?.expiresAt || 0).toISOString(),
    );

    return c.json(cachedData);
  }

  const url = new URL(`https://api.usefathom.com/v1/aggregations/`);
  url.searchParams.set("site_id", siteId);
  url.searchParams.set("entity_id", siteId);
  url.searchParams.set("entity", "pageview");
  url.searchParams.set("aggregates", "pageviews");
  url.searchParams.set("field_grouping", "pathname");

  const filters = [
    {
      property: "pathname",
      operator: "is not like",
      value: "/learn/profile*",
    },
    {
      property: "pathname",
      operator: "is not like",
      value: "*/share/*",
    },
    {
      property: "pathname",
      operator: "is not like",
      value: "*/exam/*",
    },
    {
      property: "pathname",
      operator: "is not like",
      value: "*/cohort/*",
    },
    {
      property: "pathname",
      operator: "is like",
      value: "/learn*",
    },
  ];

  url.searchParams.set("filters", JSON.stringify(filters));
  url.searchParams.set("sort_by", "pageviews:desc");

  // Set date range to last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  url.searchParams.set("date_from", thirtyDaysAgo.toISOString().split("T")[0]);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return c.json({
        error: "Fathom API request failed",
        status: response.status,
        details: errorData,
      });
    }

    const data = await response.json();

    // Cache the successful response
    setCachedResponse("fathom", siteId, data);

    // Add cache headers for cache miss
    c.header("X-Cache", "MISS");
    c.header(
      "X-Cache-Expires",
      new Date(
        Date.now() +
          (process.env.NODE_ENV === "development"
            ? 10 * 60 * 1000
            : 5 * 60 * 1000),
      ).toISOString(),
    );

    return c.json(data);
  } catch (error) {
    console.error("Error fetching Fathom stats:", error);
    return c.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      500,
    );
  }
});
