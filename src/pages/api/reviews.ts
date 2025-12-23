import type { APIRoute } from "astro";
import { kv } from "@vercel/kv";
import reviewsData from "../../data/reviews.json";

export const GET: APIRoute = async () => {
  try {
    const reviews = await kv.get("reviews") || reviewsData;
    
    return new Response(
      JSON.stringify({
        ok: true,
        reviews,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: true,
        reviews: reviewsData,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};