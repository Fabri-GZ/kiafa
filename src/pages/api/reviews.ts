import type { APIRoute } from "astro";
import reviewsData from "../../data/reviews.json";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      reviews: reviewsData,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    }
  );
};