import type { Review } from "../../types/review";
import { StarRating } from "../common/StarRating";
import { IconCheck } from "../common/Icons";

export interface ReviewCardProps {
  review: Review;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function ReviewCard({ review }: ReviewCardProps) {
  const formattedDate = (() => {
    try {
      return dateFormatter.format(new Date(review.date));
    } catch {
      return review.date;
    }
  })();

  return (
    <article className="space-y-2.5 rounded-lg border border-line bg-card/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <StarRating
            rating={review.rating}
            ariaLabel={`Rated ${review.rating} out of 5`}
          />
          <h4 className="text-sm font-medium text-ink">{review.title}</h4>
        </div>
        <time dateTime={review.date} className="text-xs text-mute">
          {formattedDate}
        </time>
      </div>

      <p className="text-xs leading-relaxed text-ink/90 sm:text-sm">
        {review.body}
      </p>

      <div className="flex items-center gap-2 pt-1 text-xs text-mute">
        <span className="font-medium text-ink">{review.author}</span>
        {review.verified && (
          <span className="inline-flex items-center gap-1 text-[11px] text-accent font-medium">
            <IconCheck width={12} height={12} /> Verified Buyer
          </span>
        )}
      </div>
    </article>
  );
}
