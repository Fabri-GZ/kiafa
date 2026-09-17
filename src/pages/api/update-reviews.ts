import type { APIRoute } from "astro";
import { fetchReviews, mapApifyReviews } from "../../lib/reviews";
import { kv } from "@vercel/kv";
import rawFallback from "../../data/reviews.json";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const live = await fetchReviews();
    const source = live.length > 0 ? "apify" : "fallback";
    const reviews = live.length > 0 ? live : mapApifyReviews(rawFallback as any[]);

    // Never wipe KV with an empty array: a failed Apify run must never erase
    // the testimonials already live on every page. Only write when there is
    // something usable, whether from Apify or the static fallback.
    if (reviews.length > 0) {
      await kv.set("reviews", reviews);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        count: reviews.length,
        source,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[update-reviews] Error storing reviews:", error);
    return new Response("Error", { status: 500 });
  }
};
