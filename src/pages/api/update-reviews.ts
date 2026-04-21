import type { APIRoute } from "astro";
import { fetchReviews } from "../../lib/reviews";
import { kv } from "@vercel/kv";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const reviews = await fetchReviews();
    await kv.set("reviews", reviews);

    return new Response(
      JSON.stringify({
        ok: true,
        count: reviews.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[update-reviews] Error storing reviews:", error);
    return new Response("Error", { status: 500 });
  }
};
