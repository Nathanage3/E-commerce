import { Link } from 'react-router-dom';
import './UploadedCourses.css';
import { InstCourse } from '../../../fakeData';
import CourseCard from '../../../components/CourseCard/CourseCard';

const UploadedCourses = () => {
  console.log(InstCourse);

  return (
    <div className="uploaded_crs_content">
      {!InstCourse && (
        <div className="no_cc">
          <p className="acc_p">
            When you create a course, it will appear here.
          </p>
          <Link className="browse_link" to="/instructor/create-new-course">
            Create A Course Now
          </Link>
        </div>
      )}
      {InstCourse?.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}
    </div>
  );
};

export default UploadedCourses;
