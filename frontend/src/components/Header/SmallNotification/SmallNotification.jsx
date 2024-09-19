import { useState } from 'react';
import './SmallNotification.css';
const SmallNotification = () => {
  const [notfiType, setNotfiType] = useState('student');
  return (
    <div className="notifi_dropdown">
      <div className="nf_dd_header">Notifications</div>
      <div className="notfi_type_div">
        <button
          className={`notfi_type_btn ${
            notfiType === 'student' ? 'active_type' : ''
          }`}
          onClick={() => setNotfiType('student')}
        >
          Student
        </button>
        <button
          className={`notfi_type_btn ${
            notfiType === 'instructor' ? 'active_type' : ''
          }`}
          onClick={() => setNotfiType('instructor')}
        >
          Instructor
        </button>
      </div>
      {notfiType === 'student' ? (
        <div className="notfi_content">
          <div className="empty_notf">No Notifications.</div>
        </div>
      ) : (
        <div className="notfi_content">
          <div className="empty_notf">No Notifications.</div>
        </div>
      )}
    </div>
  );
};

export default SmallNotification;
