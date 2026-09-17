import { ApifyClient } from "apify-client";

export type Review = { name: string; text: string; rating: number; url: string };

const REVIEWS_CAP = 15;

// WARNING - DO NOT use this list to compute schema.org aggregateRating.
// The stars >= 4 filter below discards 1-star reviews, producing a
// flattering average (15 reviews at 5.0) that does not match the real GBP
// figure (19 reviews at 4.58). Publishing it is a fabricated rating and a
// manual-action risk. Any aggregateRating must come from the UNFILTERED set
// or from the real GBP value. See src/lib/schema.ts - no node builder there
// emits aggregateRating, and none may be added.
// (This filter lives in mapApifyReviews(); referred to as getReviews() in
// design notes, but the exported symbol here is fetchReviews.)
export function mapApifyReviews(items: any[]): Review[] {
  return items
    .filter((review: any) => review.stars >= 4 && review.text?.trim().length > 0)
    .map((review: any) => ({
      name: review.name
        ? `${review.name.split(" ")[0]} ${review.name.split(" ")[1]?.[0] ?? ""}.`
        : "Cliente verificado",
      text: review.text.trim(),
      rating: review.stars,
      url: review.reviewUrl,
    }))
    .slice(0, REVIEWS_CAP);
}

export async function fetchReviews(): Promise<Review[]> {
  try {
    const client = new ApifyClient({
      token: import.meta.env.APIFY_TOKEN,
    });

    const input = {
      startUrls: [
        {
          url: import.meta.env.GOOGLE_MAPS_PLACE_URL,
        },
      ],
      maxReviews: 100,
      language: "es-419",
      personalData: true,
      reviewsSort: "newest",
    };

    const run = await client
      .actor("compass/google-maps-reviews-scraper")
      .call(input);

    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    return mapApifyReviews(items);
  } catch (error) {
    console.error("[fetchReviews] Apify error:", error);
    return [];
  }
}