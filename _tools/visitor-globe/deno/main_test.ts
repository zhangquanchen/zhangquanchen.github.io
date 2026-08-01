/**
 * Behaviour tests for the recorder. Run against a scratch KV database:
 *
 *     deno task test
 *
 * The dedup window is squeezed to two seconds via DEDUP_HOURS so the expiry
 * path is exercised for real rather than assumed.
 */
import { assertEquals } from "jsr:@std/assert@1";

const ORIGIN = "https://zhangquanchen.github.io";

const { handler } = await import("./main.ts");

function hit(ip: string, params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  return handler(
    new Request(`http://localhost/hit?${qs}`, {
      headers: { "x-forwarded-for": ip, origin: ORIGIN },
    }),
  );
}

function get(path: string, origin = ORIGIN) {
  return handler(
    new Request(`http://localhost${path}`, { headers: { origin } }),
  );
}

const BEIJING = {
  cc: "CN",
  lat: "39.9042",
  lon: "116.4074",
  city: "Beijing",
  country: "China",
};
const SF = {
  cc: "US",
  lat: "37.7749",
  lon: "-122.4194",
  city: "San Francisco",
  country: "United States",
};

Deno.test("counts a first-time visitor", async () => {
  const body = await (await hit("1.2.3.4", BEIJING)).json();
  assertEquals(body.ok, true);
  assertEquals(body.counted, true);
  assertEquals(body.total, 1);
});

Deno.test("ignores the same visitor inside the dedup window", async () => {
  const body = await (await hit("1.2.3.4", BEIJING)).json();
  assertEquals(body.counted, false);
  assertEquals(body.total, 1);
});

Deno.test("folds a nearby visitor into the same cell", async () => {
  const body =
    await (await hit("5.6.7.8", { ...BEIJING, lat: "39.91", lon: "116.40" }))
      .json();
  assertEquals(body.counted, true);
  assertEquals(body.regions, 1);
  assertEquals(body.total, 2);
});

Deno.test("opens a new cell for a distant visitor", async () => {
  const body = await (await hit("9.9.9.9", SF)).json();
  assertEquals(body.regions, 2);
  assertEquals(body.total, 3);
});

Deno.test("rejects coordinates it cannot place", async () => {
  const bad: Record<string, string>[] = [
    { cc: "CN" },
    { lat: "999", lon: "116" },
    { lat: "39", lon: "999" },
    { lat: "not-a-number", lon: "116" },
  ];
  for (const params of bad) {
    assertEquals((await hit("4.4.4.4", params)).status, 400);
  }
});

Deno.test("/cells reports the accumulated map", async () => {
  const body = await (await get("/cells")).json();
  assertEquals(body.regions, 2);
  assertEquals(body.total, 3);
  assertEquals(body.cells["40,116"].n, 2);
  assertEquals(body.cells["40,116"].l, "Beijing, China");
  assertEquals(body.cells["38,-122"].cc, "US");
});

Deno.test("never answers with a wildcard origin", async () => {
  for (const origin of [ORIGIN, "https://evil.example"]) {
    const res = await get("/cells", origin);
    assertEquals(res.headers.get("access-control-allow-origin"), ORIGIN);
  }
});

Deno.test("refuses writes and unknown routes", async () => {
  const post = await handler(
    new Request("http://localhost/hit", { method: "POST" }),
  );
  assertEquals(post.status, 405);
  assertEquals((await get("/nope")).status, 404);
});

Deno.test("counts the same visitor again once the window lapses", async () => {
  await new Promise((r) => setTimeout(r, 3500));
  const body = await (await hit("1.2.3.4", BEIJING)).json();
  assertEquals(body.counted, true);
  assertEquals(body.total, 4);
});
