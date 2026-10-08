export interface StarRatingProps {
  rating: number;
  count?: number;
  className?: string;
}

export function StarRating({ rating, count, className = "" }: StarRatingProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs text-mute ${className}`}
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="#161412" aria-hidden="true">
        <path d="m12 2.5 2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5 6.1 20.7l1.2-6.6L2.5 9.5l6.6-.9L12 2.5Z" />
      </svg>
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </span>
  );
}
