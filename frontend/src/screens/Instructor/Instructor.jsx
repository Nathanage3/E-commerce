import { NavLink, Outlet } from 'react-router-dom';
import './Instructor.css';
const Instructor = () => {
  return (
    <div className="instructor_page">
      <div className="inst_page_header">
        <nav className="inst_nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ins_active_link ins_link' : 'ins_link'
            }
            to="/instructor/uploaded-courses"
          >
            Uploaded Courses
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ins_active_link ins_link' : 'ins_link'
            }
            to="/instructor/create-new-course"
          >
            Create Course
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ins_active_link ins_link' : 'ins_link'
            }
            to="/instructor/earnings"
          >
            Earnings
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Instructor;
