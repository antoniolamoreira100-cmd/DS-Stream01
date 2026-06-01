import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

export function StarRating({ rating, max = 10, size = 14 }: StarRatingProps) {
  const normalized = (rating / max) * 5;
  const full = Math.floor(normalized);
  const hasHalf = normalized - full >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? 'fill-yellow-400 text-yellow-400'
              : i === full && hasHalf
              ? 'fill-yellow-400/50 text-yellow-400'
              : 'fill-transparent text-white/30'
          }
        />
      ))}
      <span className="ml-1 text-xs text-white/60">{rating.toFixed(1)}</span>
    </div>
  );
}
