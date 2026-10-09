export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number; // integer 1-5
  date: string; // ISO date string, e.g. "2026-03-12"
  title: string;
  body: string;
  verified: boolean;
}
