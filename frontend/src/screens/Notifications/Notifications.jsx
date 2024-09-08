import { useLocation } from 'react-router-dom';
import './Notifications.css';
const Notifications = () => {
  const location = useLocation();
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  return (
    <div
      className={`notifi_page ${isInstructorRoute ? 'inst_notifi_page' : ''}`}
    >
      <div className="notfi_p_content">
        <h1>Notifications</h1>
        <p>No Notifications.</p>
      </div>
    </div>
  );
};

export default Notifications;
