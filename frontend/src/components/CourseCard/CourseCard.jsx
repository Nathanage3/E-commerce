/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import './CourseCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
const CourseCard = ({ course }) => {
  const { addToCart } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  let totalRating = (
    (1 * course.stars?.a +
      2 * course.stars?.b +
      3 * course.stars?.c +
      4 * course.stars?.d +
      5 * course.stars?.e) /
      course.stars?.a +
    course.stars?.b +
    course.stars?.c +
    course.stars?.d +
    course.stars?.e
  ).toFixed(2);

  let duration = new Date(course.courseDuration * 1000);
  let hours = duration.getUTCHours();
  let minutes = duration.getUTCMinutes();

  let durationInHrs =
    hours?.toString().padStart(2, '0') +
    '.' +
    minutes?.toString().padStart(1, '0');

  const handleAddToCart = (course) => {
    setLoading(true);
    addToCart(course);
    setTimeout(() => {
      // Your add to cart logic here
      console.log(`${course.title} added to cart`);
      setLoading(false);
    }, 2000);
  };
  return (
    <article className="course_card">
      <div className="cc_inner_div">
        <div className="course_img">
          <img src={course.img} alt="course thumbnail" className="" />
        </div>
        <div className="course_card_body">
          <div className="cc_ttl">{course.title}</div>
          <div className="cc_sub_ttl">{course.subTitle}</div>
          <div className="cc_stats">
            <div className="cc_rating">{totalRating}</div>
            <div className="cc_rating2">{totalRating}</div>
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
          <Link className="view_cc_link" to={`/courses/${course.id}`}>
            View Course Details
          </Link>

          <div className="add_btns">
            <button
              disabled={loading}
              onClick={() => handleAddToCart(course)}
              className="add_to_cart_btn center"
            >
              {' '}
              {loading ? <span className="spinner"></span> : 'Add To Cart'}
            </button>
            <div className="add_to_wish center">
              <FontAwesomeIcon className="icon_heart" icon={faHeart} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default CourseCard;
