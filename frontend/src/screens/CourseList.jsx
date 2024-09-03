import Slider from 'react-slick';
import CourseCard from '../components/CourseCard/CourseCard';
import { courseData } from '../fakeData';
import { settings } from '../utils/sliderSetting';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Outlet } from 'react-router-dom';
const CourseList = () => {
  const { addToCart, addToWish } = useContext(AppContext);
  const handleAddToCart = (course) => {
    addToCart(course);
  };
  const handleAddToWish = (course) => {
    addToWish(course);
  };
  return (
    <section className="course_list_content">
      <Outlet />
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
    </section>
  );
};

export default CourseList;
