import { StarRating } from "../common/StarRating";

export interface ReviewSummaryProps {
  rating: number;
  reviewCount?: number;
}

export function ReviewSummary({ rating, reviewCount }: ReviewSummaryProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-3 rounded-lg border border-line bg-card/60 p-4">
      <span className="font-display text-3xl font-light text-ink">
        {rating.toFixed(1)}
      </span>
      <div className="flex flex-col gap-0.5">
        <StarRating
          rating={rating}
          ariaLabel={`Average store rating: ${rating.toFixed(1)} out of 5 stars`}
        />
        {reviewCount !== undefined && (
          <span className="text-xs text-mute">
            Based on {reviewCount} verified customer ratings
          </span>
        )}
      </div>
    </div>
  );
}
