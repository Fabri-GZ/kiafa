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
    console.error("Error obteniendo reviews:", error);
    return [];
  }
}