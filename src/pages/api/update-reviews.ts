import type { APIRoute } from "astro";
import { fetchReviews } from "../../lib/reviews";
import { put } from "@vercel/blob";

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const reviews = await fetchReviews();

    const blob = await put(
      "reviews.json",
      JSON.stringify(reviews, null, 2),
      {
      access: "public",
      contentType: "application/json",
      }
    );

    return new Response(
      JSON.stringify({
        ok: true,
        count: reviews.length,
        url: blob.url,
      }),
      { status: 200 }
    );
  } catch (e) {
    return new Response("Error updating reviews", { status: 500 });
  }
};
