import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropDownWrapper from '../Header/DropDownWrapper';
import SmallNotification from '../Header/SmallNotification/SmallNotification';
import './InstructorHeader.css';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import useDropdown from '../../hooks/useDropdown';
import { AppContext } from '../../contexts/AppContext';
import { useContext } from 'react';
import SmallUserProfile from '../UserProfile/SmallUserProfile';
import { Link } from 'react-router-dom';

const InstructorHeader = () => {
  const [isNotificationOpen, toggleNotification] = useDropdown();
  const { toggleUserDropdown, isUserDropDownOpen } = useContext(AppContext);

  return (
    <header className="inst_header">
      <h1 className="inst_header_heading">Instructor</h1>

      <div className="always_on">
        <Link className="inst_nav_link" to={'/'}>
          Student
        </Link>
        <DropDownWrapper
          isOpen={isNotificationOpen}
          toggleDropdown={toggleNotification}
          title="Notifications_inst"
          icon={faBell}
          link="/instructor/notifications"
        >
          <span className="notification_counter center">0</span>
          {isNotificationOpen && <SmallNotification />}
        </DropDownWrapper>
        <div onClick={toggleUserDropdown} className="nav_user_btn center">
          <div className="center">
            <FontAwesomeIcon icon={faUser} className="icon_avatar" />
          </div>
        </div>
      </div>
      {isUserDropDownOpen && <SmallUserProfile />}
    </header>
  );
};

export default InstructorHeader;
