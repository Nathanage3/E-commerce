import Slider from 'react-slick';
import CourseCard from '../components/CourseCard/CourseCard';
import { courseData } from '../fakeData';
import { settings } from '../utils/sliderSetting';
const CourseList = () => {
 
  return (
    <section className="course_list_content">
      <h2>Browse Courses</h2>
      <div className="sider_container">
        <Slider {...settings}>
          {courseData.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))}
        </Slider>
      </div>
      
    </section>
  );
};

export default CourseList;
