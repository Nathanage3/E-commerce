import { Link, useParams } from 'react-router-dom';
import './CourseDescription.css';
import Layout from '../../components/Layout';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { courseData } from '../../fakeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
// import { FaHeart } from 'react-icons/fa'
const CourseDescription = () => {
  const { id } = useParams();
  const { addToCart } = useContext(AppContext);
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
      // Your add to cart logic here
      console.log(`${course.title} added to cart`);
      setLoading(false);
    }, 2000);
  };

  let totalRating = (
    (1 * displayedCourse.stars?.a +
      2 * displayedCourse.stars?.b +
      3 * displayedCourse.stars?.c +
      4 * displayedCourse.stars?.d +
      5 * displayedCourse.stars?.e) /
      displayedCourse.stars?.a +
    displayedCourse.stars?.b +
    displayedCourse.stars?.c +
    displayedCourse.stars?.d +
    displayedCourse.stars?.e
  ).toFixed(2);

  let duration = new Date(displayedCourse.courseDuration * 1000);
  let hours = duration.getUTCHours();
  let minutes = duration.getUTCMinutes();

  let durationInHrs =
    hours?.toString().padStart(2, '0') +
    '.' +
    minutes?.toString().padStart(1, '0');

  return (
    <Layout>
      <div className="course_desc_page">
        <div className="desc_content">
          <div className="desc_page_header">
            <div>
              <div className="desc_cc_ttl">{displayedCourse.title}</div>
              <div className="cc_stats">
                <div className="cc_rating">{totalRating}</div>
                <div className="cc_rating2">{totalRating}</div>
                <div className="cc_rate_count">
                  ({displayedCourse.ratingCount})
                </div>
              </div>
              <div className="creator">
                Created By: {displayedCourse.createdBy}
              </div>
              <div className="small_width">
                <div className="cc_details">
                  <div>{durationInHrs} total hours</div>
                  <div className="cc_dur">{displayedCourse.level}</div>
                  <div>
                    <strong>Subtitles</strong>
                  </div>
                </div>
                <div className="desc_cc_sub_text">{displayedCourse.detail}</div>
                <div className="small_width">
                  <div className="flex_base">
                    <div className="desc_cc_tag">BEST SELLER</div>
                    <div className="desc_cc_update">
                      Updated <b>{displayedCourse.updatedDate}</b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="desc_course_img">
              <img
                src={displayedCourse.img}
                alt="course thumbnail"
                className=""
              />
            </div>
          </div>

          <div className="desc_add_btns">
            <button
              disabled={loading}
              onClick={() => handleAddToCart(selectedCourse)}
              className="add_to_cart_btn center"
            >
              {' '}
              {loading ? <span className="spinner"></span> : 'Add To Cart'}
            </button>
            <div className="add_to_wish center">
              <FontAwesomeIcon className="icon_heart" icon={faHeart} />
            </div>
            <Link
              to={'/checkout'}
              className="add_to_cart_btn center"
            >
              BUY NOW
            </Link>
          </div>
        </div>
        <div className="desc_page_list">
          <h4>What you&apos;ll learn</h4>
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
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default CourseDescription;
