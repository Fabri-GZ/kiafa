import type { APIRoute } from "astro";
import { fetchReviews } from "../../lib/reviews";
import { kv } from "@vercel/kv";

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
        message: "Reviews actualizadas",
        count: reviews.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating reviews:", error);
    return new Response(
      JSON.stringify({ ok: false, error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};