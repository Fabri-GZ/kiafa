import type { APIRoute } from "astro";
import { fetchReviews } from "../../lib/reviews";
import { kv } from "@vercel/kv";

export const GET: APIRoute = async ({ url }) => {
  const secret = url.searchParams.get("secret");
  
  if (secret !== import.meta.env.CRON_SECRET) {
    console.log("Unauthorized - secret invalido");
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log("Fetching reviews from Apify...");
    const reviews = await fetchReviews();
    
    console.log(`Got ${reviews.length} reviews, saving to KV...`);
    await kv.set("reviews", reviews);
    
    console.log("Reviews saved successfully");

    return new Response(
      JSON.stringify({
        ok: true,
        message: "Reviews actualizadas en KV",
        count: reviews.length,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating reviews:", error);
    return new Response(
      JSON.stringify({ 
        ok: false, 
        error: error instanceof Error ? error.message : String(error) 
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};