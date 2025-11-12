import { Hono } from "hono";
import { cors } from "hono/cors";
import { config } from "dotenv";

// Load environment variables
config({ quiet: true });

// Import route modules
import { healthRoutes } from "./src/routes/health.js";
import { fathomRoutes } from "./src/routes/fathom.js";
import { cacheRoutes } from "./src/routes/cache.js";
import { aiRoutes } from "./src/routes/ai.js";

const app = new Hono();

// Enable CORS for route: https://www.sanity.io/ or localhost:3333
const allowedOrigins = [
  "http://localhost:3333",
  "http://localhost:3000",
  "http://localhost:5173",
];

if (process.env.SANITY_STUDIO_URL) {
  allowedOrigins.push(process.env.SANITY_STUDIO_URL);
}

app.use(
  "/*",
  cors({
    origin: allowedOrigins,
  }),
);

// Mount routes
app.route("/", healthRoutes);
app.route("/fathom", fathomRoutes);
app.route("/cache", cacheRoutes);
app.route("/ai", aiRoutes);

export default app;
