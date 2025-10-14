import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import * as z from "zod";

// a reusable response-validator factory (for JSON responses)
export function responseValidator(schema: z.ZodTypeAny) {
  return async (c: Context, next: Next) => {
    await next(); // run handler
    const res = c.res;
    if (!res) return;
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) return;

    // clone() so downstream can still use the response stream
    const body = await res
      .clone()
      .json()
      .catch(() => undefined);
    if (body === undefined) return;

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      // choose how you want to surface the error:
      // - throw HTTPException to be caught by your onError
      // - log and return a sanitized 500 / 502 / 500
      throw new HTTPException(500, {
        message: "Response validation failed\n",
        cause: z.prettifyError(parsed.error),
        res: new Response(
          JSON.stringify({
            status: 500,
            error: "Internal Server Error",
            message: z.prettifyError(parsed.error),
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        ),
      });
    }
  };
}
