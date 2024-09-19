import { Link } from 'react-router-dom';
import './UploadedCourses.css';
import { InstCourse } from '../../../fakeData';
import CourseCard from '../../../components/CourseCard/CourseCard';

const UploadedCourses = () => {
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
      <div className="uploaded_crs_listing">
        <div className="inst_content_hdr">
          Your have<span className="crs_count">{InstCourse.length}</span>Courses
        </div>
        <div className="uploaded_crs_list">
          {InstCourse?.map((course) => (
            <CourseCard course={course} key={course.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadedCourses;
