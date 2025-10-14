import process from "node:process";

import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";

import { v1, v1PathPrefix } from "./v1/index.js";
// import { admin } from "./admin/index.js";

const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route(v1PathPrefix, v1);
// app.route("admin", admin);

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// graceful shutdown
process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});
process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
