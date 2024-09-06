import { Link } from 'react-router-dom';
import './CourseCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import StarRating from '../StarRating/StarRating';
import { AppContext } from '../../contexts/AppContext';
import PropTypes from 'prop-types';
const CourseCard = ({ course }) => {
  const { addToCart, addToWish } = useContext(AppContext);
  const [cartLoading, setCartLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  let duration = new Date(course.courseDuration * 1000);
  let hours = duration.getUTCHours();
  let minutes = duration.getUTCMinutes();

  let durationInHrs =
    hours?.toString().padStart(2, '0') +
    '.' +
    minutes?.toString().padStart(1, '0');

  const handleAddToCart = (course) => {
    setCartLoading(true);
    addToCart(course);
    setTimeout(() => {
      setCartLoading(false);
    }, 500);
  };
  const handleAddToWish = (course) => {
    setWishLoading(true);
    addToWish(course);
    setTimeout(() => {
      setWishLoading(false);
    }, 500);
  };
  return (
    <article className="course_card">
      <Link to={`/course/${course.id}`} className="cc_inner_div">
        <div className="course_img">
          <img src={course.img} alt="course thumbnail" className="" />
        </div>
      </Link>
      <div className="course_card_body">
        <div className="cc_ttl">{course.title}</div>
        <div className="cc_sub_ttl">{course.subTitle}</div>
        <div className="cc_stats">
          <StarRating rating={course.stars} />
          <div className="cc_rate_count">({course.ratingCount})</div>
        </div>
        <div className="cc_pricing">
          <span className="cc_price">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(course.price)}
          </span>
          <span className="cc_old_price">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(course.oldPrice)}
          </span>
        </div>
        <div className="cc_tag">BEST SELLER</div>
      </div>

      <div className="cc_hov_card">
        <div className="flex_base">
          <div className="cc_tag">BEST SELLER</div>
          <div className="cc_update">
            Updated <b>{course.updatedDate}</b>
          </div>
        </div>
        <div className="cc_details">
          <div>{durationInHrs} hrs</div>
          <div className="cc_dur">{course.level}</div>
          <div>
            <strong>Subtitles</strong>
          </div>
        </div>
        <Link to={`/course/${course.id}`} className="view_cc_link">
          View Course Details
        </Link>

        <div className="add_btns">
          <button
            disabled={cartLoading}
            onClick={() => handleAddToCart(course)}
            className="add_to_cart_btn center"
          >
            {cartLoading ? <span className="spinner"></span> : 'Add To Cart'}
          </button>
          <div
            className="add_to_wish center"
            onClick={() => handleAddToWish(course)}
          >
            {wishLoading ? (
              <span className="spinner"></span>
            ) : (
              <FontAwesomeIcon className="cc_icon_heart" icon={faHeart} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
CourseCard.propTypes = {
  course: PropTypes.object.isRequired,
};
export default CourseCard;
