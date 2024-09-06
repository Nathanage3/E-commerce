import { Link } from 'react-router-dom';
import './UploadedCourses.css';
const UploadedCourses = () => {
  return (
    <div className="uploaded_crs_content">
      <div className="no_cc">
        <p className="acc_p">When you create a course, it will appear here.</p>
        <Link className="browse_link" to="/instructor/create-new-course">
          Create A Course Now
        </Link>
      </div>
    </div>
  );
};

export default UploadedCourses;
