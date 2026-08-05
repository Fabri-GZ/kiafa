import { ApifyClient } from "apify-client";

export async function fetchReviews() {
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
      reviewsSort: "highestRanking",
    };

    const run = await client
      .actor("compass/google-maps-reviews-scraper")
      .call(input);

    const { items } = await client
      .dataset(run.defaultDatasetId)
      .listItems();

    // WARNING - DO NOT use this list to compute schema.org aggregateRating.
    // The .filter(stars >= 4) below discards 1-star reviews, producing a
    // flattering average (15 reviews at 5.0) that does not match the real GBP
    // figure (17 reviews at 4.5). Publishing it is a fabricated rating and a
    // manual-action risk. Any aggregateRating must come from the UNFILTERED set
    // or from the real GBP value. See src/lib/schema.ts - no node builder there
    // emits aggregateRating, and none may be added.
    // (This filter lives in fetchReviews(); referred to as getReviews() in
    // design notes, but the exported symbol here is fetchReviews.)
    const reviews = items
      .filter((review: any) => review.stars >= 4)
      .map((review: any) => ({
        name: review.name
          ? `${review.name.split(" ")[0]} ${review.name.split(" ")[1]?.[0] ?? ""}.`
          : "Cliente verificado",
        text: review.text,
        rating: review.stars,
        url: review.reviewUrl,
      }));

    return reviews;
  } catch (error) {
    console.error("[fetchReviews] Apify error:", error);
    return [];
  }
}