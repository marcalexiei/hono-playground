import { Scalar } from "@scalar/hono-api-reference";
import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const adminPathPrefix = "admin";

const route = createRoute({
  method: "get",
  path: "/metrics",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({}),
        },
      },
      description: "Retrieve the user",
    },
  },
});

const app = new OpenAPIHono();

app.openapi(route, (c) => {
  return c.json({ ciao: 1 });
});

// The OpenAPI documentation will be available at /openapi.json
app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Admin API",
  },
  servers: [{ url: `/${adminPathPrefix}`, description: "local" }],
});

app.get(
  "/docs",
  Scalar({ url: `/${adminPathPrefix}/openapi.json`, pageTitle: "Admin API" })
);

export { app as admin };
