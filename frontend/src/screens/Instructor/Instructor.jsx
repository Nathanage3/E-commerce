import { NavLink, Outlet } from 'react-router-dom';
import './Instructor.css';
const Instructor = () => {
  return (
    <div className="instructor_page">
      <aside className="inst_page_side_bar">
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
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ins_active_link ins_link' : 'ins_link'
            }
            to="/instructor/notifications"
          >
            Notifications
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ins_active_link ins_link' : 'ins_link'
            }
            to="/instructor/profile"
          >
            Profile
          </NavLink>
        </nav>
      </aside>
      <Outlet />
    </div>
  );
};

export default Instructor;
