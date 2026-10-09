import type { Review } from "../types/review";
import rawReviews from "../data/reviews.json";

const reviews: Review[] = rawReviews as Review[];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}

export function getAllReviews(): Review[] {
  return reviews;
}
