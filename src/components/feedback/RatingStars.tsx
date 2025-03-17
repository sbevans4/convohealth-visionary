
import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onChange: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
