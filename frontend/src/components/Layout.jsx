import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import SideNav from './SideNav/SideNav';
import Popup from './Popup/Popup';
import PropTypes from 'prop-types';
import InstructorHeader from './InstructorHeader/InstructorHeader';

const Layout = ({ children }) => {
  const { showNav, showPopup, addedCourse, popupType } = useContext(AppContext);
  const location = useLocation();
  const isInstructorRoute = location.pathname.startsWith('/instructor');
  return (
    <div className={`App ${showNav ? 'modal_open' : ''}`}>
      {showNav && <SideNav />}
      {showPopup && addedCourse && (
        <Popup course={addedCourse} addType={popupType} />
      )}
      {isInstructorRoute ? <InstructorHeader /> : <Header />}

      <main className="main_content">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
