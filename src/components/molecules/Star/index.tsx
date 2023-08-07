import React from 'react';
import { Rating } from '@mui/material';

interface StarProps {
  className?: string;
  value: number;
  height: number;
  spacing: number;
}

const Star: React.FC<StarProps> = ({ className, value, height, spacing }) => {
  const integerRating = Math.floor(value);
  const decimalRating = value - integerRating;

  return (
    <div className={['stars', className].join(' ')} style={{ height }}>
      <Rating name="star-rating" value={integerRating} readOnly precision={1} />
      {decimalRating > 0 && (
        <Rating
          name="star-rating"
          value={decimalRating}
          readOnly
          precision={0.5}
          style={{ marginLeft: spacing }}
        />
      )}
    </div>
  );
};

export default Star;
