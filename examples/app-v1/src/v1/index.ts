import { Hono } from "hono";
import { Scalar } from "@scalar/hono-api-reference";
import {
  validator,
  openAPIRouteHandler,
  describeResponse,
  describeRoute,
} from "hono-openapi";
import * as z from "zod";

export const v1PathPrefix = "v1";

const ParamsSchema = z.object({
  id: z.string().min(3),
});

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
});

const app = new Hono();

// app.use(
//   describeRoute({
//     responses: {
//       500: {
//         description: "Internal",
//         content: {
//           "application/json": {
//             schema: resolver(z.object({ message: z.string() })),
//           },
//         },
//       },
//     },
//   })
// );

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

const successResponseSchema = z.object({
  message: z.string(),
});

const errorResponseSchema = z.object({
  error: z.string(),
});

app.get(
  "/",
  describeResponse(
    (c) => {
      return c.json({ message: "Hello" }, 200);
    },
    {
      200: {
        description: "Success",
        content: {
          "application/json": {
            vSchema: successResponseSchema,
          },
        },
      },
      400: {
        description: "Error",
        content: {
          "application/json": {
            vSchema: errorResponseSchema,
          },
        },
      },
    }
  )
);

// The OpenAPI documentation will be available at /openapi.json
app.get(
  "/openapi.json",
  openAPIRouteHandler(app, {
    documentation: {
      openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "V1 API",
      },
      servers: [{ url: `/${v1PathPrefix}`, description: "local" }],
    },
  })
);

app.get(
  "/docs",
  Scalar({
    url: `/${v1PathPrefix}/openapi.json`,
    pageTitle: "V1 API",
    onBeforeRequest: (a) => {
      console.info(a);
      a.request.headers.set("ciao", "ciao");
    },
  })
);

export { app as v1 };
