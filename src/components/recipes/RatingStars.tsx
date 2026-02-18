import { Star } from 'lucide-react';

const RatingStars = ({ count }: { count: number }) => (
  <span className="flex items-center gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={1} className="text-xs fill-yellow-400 text-yellow-400" />
    ))}
  </span>
);

export default RatingStars;
