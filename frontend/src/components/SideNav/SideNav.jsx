import { Link } from 'react-router-dom';
import './SideNav.css';
import { MdClose } from 'react-icons/md';
import { categoriesData } from '../../fakeData';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';

const SideNav = () => {
  const { isAuthenticated } = useAuth();
  const { handleCloseNavbar } = useContext(AppContext);
  return (
    <div className="side_nav_modal">
      <div className="side_nav_content">
        <button onClick={handleCloseNavbar} className="close_nav_btn center">
          <MdClose className="icon_close" />
        </button>
        {!isAuthenticated && (
          <div className="side_nav_auth_links">
            <Link
              onClick={handleCloseNavbar}
              to={'/login'}
              className="side_nav_login"
            >
              <FontAwesomeIcon className="login_icon" icon={faRightToBracket} />
              Sign In
            </Link>
            <Link
              onClick={handleCloseNavbar}
              to={'/signup'}
              className="side_nav_register"
            >
              Register
            </Link>
          </div>
        )}
        <Link
          to={'/user'}
          className="side_nav_user_p"
          onClick={handleCloseNavbar}
        >
          <div className="side_nav_user_btn center">
            <div className="center">
              <FontAwesomeIcon icon={faUser} className="icon_avatar" />
            </div>
          </div>
          <div className="">
            <div className="user_name">User name</div>
          </div>
        </Link>

        <div className="side_nav_header">Popular categoires</div>
        <ul className="side_nav_cats">
          {categoriesData.map((item, id) => (
            <li key={id}>
              <Link
                onClick={handleCloseNavbar}
                className="side_nav_cat"
                to={`/courses/${item.title}`}
              >
                {item.title}
              </Link>
            </li>
          ))}
          <li>
            <Link
              onClick={handleCloseNavbar}
              className="side_nav_cat"
              to={`/courses`}
            >
              All Categories
            </Link>
          </li>
        </ul>
        <div className="side_nav_links">
          <Link
            onClick={handleCloseNavbar}
            className="side_nav_link"
            to={'/instructor'}
          >
            Sell Courses
          </Link>

          {isAuthenticated && (
            <>
              <Link
                onClick={handleCloseNavbar}
                to={'/my-courses'}
                className="side_nav_link"
                title="My Courses"
              >
                My Courses
              </Link>
              <Link
                onClick={handleCloseNavbar}
                to={'/my-courses/wishlist'}
                className="side_nav_link"
              >
                Wishlist
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
