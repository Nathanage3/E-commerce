/* eslint-disable react/prop-types */
import './StarRating.css';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { AiOutlineStar } from 'react-icons/ai';
const StarRating = ({ rating }) => {
  const ratingStar = Array.from({ length: 5 }, (_, index) => {
    const number = index + 1; 

    return (
      <span key={index}>
        {rating >= number ? (
          <FaStar className="icon_star" />
        ) : rating >= number - 0.5 ? (
          <FaStarHalfAlt className="icon_star" />
        ) : (
          <AiOutlineStar className="icon_star" />
        )}
      </span>
    );
  });

  return <div className="star-rating">{ratingStar}</div>;
};

export default StarRating;
