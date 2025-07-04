import React from 'react';
    import { Star } from 'lucide-react';

    const StarRatingInput = ({ rating, setRating }) => {
      return (
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer transition-colors ${
                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      );
    };

    export default StarRatingInput;