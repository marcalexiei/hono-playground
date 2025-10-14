import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Scalar } from "@scalar/hono-api-reference";
import {
  validator,
  openAPIRouteHandler,
  describeResponse,
  describeRoute,
} from "hono-openapi";
import * as z from "zod";

const ParamsSchema = z.object({
  id: z.string().min(5),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});

const app = new Hono();

app.get(
  "/user/:id",
  describeRoute({
    summary: "test route",
  }),
  validator("param", ParamsSchema),
  describeResponse(
    (c) => {
      const { id } = c.req.valid("param");
      return c.json(
        {
          id,
          age: "20",
          name: "Ultra-man",
        },
        200
      );
    },
    {
      200: {
        description: "Success",
        content: {
          "application/json": {
            vSchema: UserSchema,
          },
        },
      },
    }
  )
);

app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "V1 API",
      },
    },
  })
);

app.get(
  "/docs",
  Scalar({
    url: `/openapi.json`,
    pageTitle: "V1 API",
  })
);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
