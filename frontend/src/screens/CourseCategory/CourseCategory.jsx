import { useParams } from 'react-router-dom';
import './CourseCategory.css';
import Slider from 'react-slick';
import CourseCard from '../../components/CourseCard/CourseCard';
import { settings } from '../../utils/sliderSetting';
import { courseData } from '../../fakeData';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
const CourseCategory = () => {
  const { category } = useParams();
  const { addToCart, addToWish } = useContext(AppContext);

  return (
    <div className="courses_cat_comp">
      <div className="course_cat_c_courses">
        <h1 className="home_c_header">{category} Courses</h1>
        <Slider {...settings}>
          {courseData.map((course, index) => (
            <CourseCard key={index} course={course} addToCart={addToCart}
            addToWish={addToWish} />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CourseCategory;
