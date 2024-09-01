import { NavLink, Outlet } from 'react-router-dom';
import Layout from '../../components/Layout';
import './MyCourses.css';
const MyCourses = () => {
  return (
    <Layout>
      <div className="my_courses_page">
        <div className="mcp_header">
          <h1 className="mcp_heading">My learning</h1>
          <nav className="mcp_nav">
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active_link mcp_link' : 'mcp_link'
              }
              to="/my-courses/learning"
            >
              All Courses
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? 'active_link mcp_link' : 'mcp_link'
              }
              to="/my-courses/wishlist"
            >
              Wishlist
            </NavLink>
          </nav>
        </div>
        <Outlet />
      </div>
    </Layout>
  );
};

export default MyCourses;
