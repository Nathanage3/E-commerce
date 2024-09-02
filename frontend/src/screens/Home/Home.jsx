import Layout from '../../components/Layout';
import Banner from '../../assets/banner3.jpg';
// import BannerSmall from '../../assets/banner3-small.jpg';
import './Home.css';
import { courseData } from '../../fakeData';
import CourseCard from '../../components/CourseCard/CourseCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { settings } from '../../utils/sliderSetting.jsx';
import Popup from '../../components/Popup/Popup.jsx';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext.jsx';
const POPUP_TIMEOUT = 3000;

const Home = () => {
  const { addToCart, addToWish } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [addedCourse, setAddedCourse] = useState(null);
  const [addType, setAddType] = useState('');
  const handleAddToCart = (course) => {
    setAddType('cart');
    addToCart(course);
    setShowPopup(true);
    setAddedCourse(course);
  };
  const handleAddToWish = (course) => {
    setAddType('wish');
    addToWish(course);
    setShowPopup(true);
    setAddedCourse(course);
  };
  useEffect(() => {
    if (addedCourse) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
      }, POPUP_TIMEOUT);
      return () => clearTimeout(timeout);
    }
  }, [addedCourse]);
  return (
    <Layout>
      <section className="home_page">
        <div className="banner_hero">
          <img src={Banner} alt="Start Learning" />
          <div className="banner_float">
            <div className="home_banner_header">Start Learning Today!</div>
            <p>
              Take control of your career. Learn the latest skills in web
              development.
            </p>
          </div>
        </div>
        <div className="home_page_content">
          <div className="home_courses">
            <h2 className="home_c_header">Best Sellers</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard
                  addToCart={handleAddToCart}
                  addToWish={handleAddToWish}
                  key={index}
                  course={course}
                />
              ))}
            </Slider>
          </div>
          <div className="home_courses">
            <h2 className="home_c_header">Web Development Courses</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard
                  addToCart={handleAddToCart}
                  addToWish={handleAddToWish}
                  key={index}
                  course={course}
                />
              ))}
            </Slider>
          </div>
          <div className="home_courses">
            <h2 className="home_c_header">Improve Your Skills</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard
                  addToCart={handleAddToCart}
                  addToWish={handleAddToWish}
                  key={index}
                  course={course}
                />
              ))}
            </Slider>
          </div>
          <div className="home_courses">
            <h2 className="home_c_header">Top Rated Courses</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard
                  addToCart={handleAddToCart}
                  addToWish={handleAddToWish}
                  key={index}
                  course={course}
                />
              ))}
            </Slider>
          </div>
          <div className="home_courses">
            <h2 className="home_c_header">Start Learning</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard
                  addToCart={handleAddToCart}
                  addToWish={handleAddToWish}
                  key={index}
                  course={course}
                />
              ))}
            </Slider>
          </div>
        </div>
        {showPopup && addedCourse && (
          <Popup course={addedCourse} addType={addType} />
        )}
      </section>
    </Layout>
  );
};

export default Home;
