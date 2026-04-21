import type { APIRoute } from "astro";
import { kv } from "@vercel/kv";

export const prerender = false;

const RATE_LIMIT = 30;
const RATE_WINDOW = 60;

async function isRateLimited(ip: string): Promise<boolean> {
  const key = `rl:reviews:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, RATE_WINDOW);
  return count > RATE_LIMIT;
}

export const GET: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown";

  try {
    if (await isRateLimited(ip)) {
      return new Response(JSON.stringify({ ok: false, error: "Too Many Requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(RATE_WINDOW),
        },
      });
    }

    const reviews = await kv.get<any[]>("reviews");

    if (!reviews || reviews.length === 0) {
      return new Response(
        JSON.stringify({ ok: true, reviews: [] }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ ok: true, reviews }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error("[reviews] KV error:", error);
    return new Response(
      JSON.stringify({ ok: false, reviews: [], error: "Internal error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};