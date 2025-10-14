# `openapi-describe-response-bug`

Reproduction example for bug with `describeResponse` not picking up types coming from validator.

Run typecheck

```sh
pnpm --filter=openapi-describe-response-bug run typecheck
```

It produces the following type errors:

```txt
src/index.ts:32:15 - error TS2339: Property 'id' does not exist on type 'unknown'.

32       const { id } = c.req.valid("param");
                 ~~

src/index.ts:32:34 - error TS2345: Argument of type '"param"' is not assignable to parameter of type 'never'.

32       const { id } = c.req.valid("param");
                                    ~~~~~~~
```

---

At runtime it works correctly:

1. Run

   ```sh
   pnpm --filter=openapi-describe-response-bug run dev
   ```

2. Open <http://localhost:3000/docs>

3. Run examples with `/user/{id}` API
