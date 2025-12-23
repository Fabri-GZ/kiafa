import type { APIRoute } from "astro";
import { kv } from "@vercel/kv";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const reviews = await kv.get<any[]>("reviews");
    
    if (!reviews || reviews.length === 0) {
      return new Response(
        JSON.stringify({
          ok: true,
          reviews: [],
          message: "No hay reviews en KV todavía"
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    
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
    console.error("Error getting reviews from KV:", error);
    return new Response(
      JSON.stringify({
        ok: false,
        reviews: [],
        error: String(error)
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};