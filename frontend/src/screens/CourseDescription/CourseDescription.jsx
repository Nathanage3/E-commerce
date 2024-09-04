import { Link, useParams } from 'react-router-dom';
import './CourseDescription.css';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { courseData } from '../../fakeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Slider from 'react-slick';
import CourseCard from '../../components/CourseCard/CourseCard';
import { settings } from '../../utils/sliderSetting.jsx';
import StarRating from '../../components/StarRating/StarRating';
const CourseDescription = () => {
  const { id } = useParams();
  const { addToCart, addToWish } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [displayedCourse, setDisplayedCourse] = useState([]);

  const selectedCourse = courseData.find(
    (course) => course.id.toString() === id
  );
  useEffect(() => {
    if (selectedCourse) {
      setDisplayedCourse(selectedCourse);
    }
  }, [id, displayedCourse, selectedCourse]);
  const handleAddToCart = (course) => {
    setLoading(true);
    addToCart(course);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleAddToWish = (course) => {
    addToWish(course);
  };

  let duration = new Date(displayedCourse.courseDuration * 1000);
  let hours = duration.getUTCHours();
  let minutes = duration.getUTCMinutes();

  let durationInHrs =
    hours?.toString().padStart(2, '0') +
    '.' +
    minutes?.toString().padStart(1, '0');

  return (
    <div className="course_desc_page">
      <div className="desc_content">
        <div className="desc_page_header">
          <div className="desc_course_img">
            <img
              src={displayedCourse.img}
              alt="course thumbnail"
              className=""
            />
          </div>
          <div className="desc_header_main">
            <div className="desc_cc_ttl">{displayedCourse.title}</div>
            <div className="creator">
              Created By:{' '}
              <span className="creator_name">{displayedCourse.createdBy}</span>
            </div>
            <div className="desc_cc_stats">
              <StarRating rating={displayedCourse.stars} />
              <div className="desc_cc_rate_count">
                ({displayedCourse.ratingCount})
              </div>
            </div>
            <div className="small_width">
              <div className="desc_cc_details">
                <div>{durationInHrs} total hours</div>
                <div className="desc_cc_dur">{displayedCourse.level}</div>
                <div>
                  <strong>Subtitles</strong>
                </div>
              </div>
              <div className="desc_cc_sub_text">{displayedCourse.detail}</div>
              <div className="small_width">
                <div className="desc_flex_base">
                  <div className="desc_cc_tag">BEST SELLER</div>
                  <div className="desc_cc_update">
                    Updated:
                    <b className="green">{displayedCourse.updatedDate}</b>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="desc_add_btns">
          <Link to={'/checkout'} className="buy_now_link center">
            BUY NOW
          </Link>
          <button
            disabled={loading}
            onClick={() => handleAddToCart(selectedCourse)}
            className="desc_add_to_cart_btn center"
          >
            {' '}
            {loading ? <span className="spinner"></span> : 'Add To Cart'}
          </button>
          <div
            className="desc_add_to_wish center"
            onClick={() => handleAddToWish(selectedCourse)}
          >
            <FontAwesomeIcon className="desc_icon_heart" icon={faHeart} />
          </div>
        </div>
        <div className="desc_page_list">
          <h4 className="desc_list_header">What you&apos;ll learn</h4>
          <ul className="cc_list">
            <li className="cc_li">
              <span className="tick"></span>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              dolore reiciendis ea maiores eos eligendi architecto illo.
              Cupiditate iure, vero, laboriosam laudantium perferendis odio
              expedita quisquam culpa quae earum provident.
            </li>
            <li className="cc_li">
              <span className="tick"></span>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora
              ullam autem impedit porro veniam, laboriosam debitis eveniet
              reprehenderit numquam atque inventore recusandae hic veritatis
              similique officia? Rerum, nesciunt! Repudiandae, sint.
            </li>
            <li className="cc_li">
              <span className="tick"></span>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora
              ullam autem impedit porro veniam, laboriosam debitis eveniet
              reprehenderit numquam atque inventore recusandae hic veritatis
              similique officia? Rerum, nesciunt! Repudiandae, sint.
            </li>
          </ul>
        </div>
      </div>
      <div className="desc_page_courses">
        <h2 className="desc_c_header">Similar Courses</h2>
        <Slider {...settings}>
          {courseData.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CourseDescription;
