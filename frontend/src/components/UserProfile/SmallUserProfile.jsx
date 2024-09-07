import { Link, useLocation } from 'react-router-dom';
import './SmallUserProfile.css';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';

const SmallUserProfile = () => {
  const { cartItems, toggleUserDropdown } = useContext(AppContext);
  const { logout } = useAuth();
  const location = useLocation();
  const isInstructorRoute = location.pathname.startsWith('/instructor');

  const handleLogout = () => {
    toggleUserDropdown();
    logout();
  };
  return (
    <div className="user_profile_dd">
      <div className="user_pr_dd_content">
        <Link
          onClick={toggleUserDropdown}
          to={'/user'}
          className="usr_pr_dd_user_link"
        >
          <div className="usr_pr_dd_icon center">
            <div className="center">
              <FontAwesomeIcon icon={faUser} className="icon_avatar" />
            </div>
          </div>
          <div className="user_info_wrap">
            <div className="user_name">User name</div>
            <div className="user_email">user@email.com</div>
          </div>
        </Link>

        <ul className="user_pr_dd_list">
          {!isInstructorRoute ? (
            <>
              <li>
                <Link
                  onClick={toggleUserDropdown}
                  to={'/cart'}
                  title={`${cartItems.length} Items in cart`}
                  className="user_pr_dd_link cart_cnt"
                >
                  My Cart{' '}
                  <span className="usr_dd_cart_counter center">
                    {cartItems.length}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  onClick={toggleUserDropdown}
                  to={'/my-courses'}
                  className="user_pr_dd_link"
                >
                  My Courses
                </Link>
              </li>
              <li>
                <Link
                  onClick={toggleUserDropdown}
                  to={'/my-courses/wishlist'}
                  className="user_pr_dd_link"
                >
                  Wishlist
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                onClick={toggleUserDropdown}
                to={'/'}
                className="user_pr_dd_link"
              >
                Student Page
              </Link>
            </li>
          )}
        </ul>

        <ul className="user_pr_dd_list">
          <li>
            <Link
              onClick={toggleUserDropdown}
              to={
                !isInstructorRoute
                  ? '/notifications'
                  : '/instructor/notifications'
              }
              className="user_pr_dd_link"
            >
              Notifications
            </Link>
          </li>
        </ul>
        <ul className="user_pr_dd_list">
          <li>
            <Link
              onClick={toggleUserDropdown}
              to={'/my-courses'}
              className="user_pr_dd_link"
            >
              Account Settings
            </Link>
          </li>
          <li>
            <Link
              onClick={toggleUserDropdown}
              to={'/edit-profile'}
              className="user_pr_dd_link"
            >
              Edit Profile
            </Link>
          </li>
        </ul>
        <ul className="user_pr_dd_list">
          <li>
            <Link
              onClick={toggleUserDropdown}
              to={'/help'}
              className="user_pr_dd_link"
            >
              Help and Support
            </Link>
          </li>
          <li>
            <Link
              onClick={handleLogout}
              to={'/'}
              className="user_pr_dd_link logout_btn"
            >
              Log out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SmallUserProfile;
