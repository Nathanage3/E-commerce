import { Link } from 'react-router-dom';

const AllCourses = () => {
  return (
    <div className="all_courses_content">
      <div className="no_cc">
        <p className="acc_p">
          When you purchase a course, it will appear here.
        </p>
        <Link className="browse_link" to="/">
          Browse Courses
        </Link>
      </div>
    </div>
  );
};

export default AllCourses;
