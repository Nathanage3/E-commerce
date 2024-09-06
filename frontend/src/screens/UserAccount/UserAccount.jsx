import { NavLink, Outlet } from 'react-router-dom';
import './UserAccount.css';

const UserAccount = () => {
  return (
    <div className="user_acc_page">
      <div className="usr_acc_header">
        <h1 className="usr_acc_heading">My Profile</h1>
        <nav className="usr_acc_nav">
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ua_active_link usr_acc_link' : 'usr_acc_link'
            }
            to="/user/profile"
          >
            Profile
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'ua_active_link usr_acc_link' : 'usr_acc_link'
            }
            to="/user/photo"
          >
            Profile Picture
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default UserAccount;
