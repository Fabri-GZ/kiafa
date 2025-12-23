import type { APIRoute } from "astro";
import { fetchReviews } from "../../lib/reviews";
import fs from "node:fs/promises";
import path from "node:path";

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${import.meta.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const reviews = await fetchReviews();
    
    const filePath = path.join(process.cwd(), "src/data/reviews.json");
    await fs.writeFile(filePath, JSON.stringify(reviews, null, 2));

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
      { status: 500 }
    );
  }
};