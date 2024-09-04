import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import SideNav from './SideNav/SideNav';
import Popup from './Popup/Popup';
import PropTypes from 'prop-types';

const Layout = ({ children }) => {
  const { showNav, showPopup, addedCourse, popupType } = useContext(AppContext);

  return (
    <div className={`App ${showNav ? 'modal_open' : ''}`}>
      {showNav && <SideNav />}
      {showPopup && addedCourse && (
        <Popup course={addedCourse} addType={popupType} />
      )}
      <Header />

      <main className="main_content">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};
Layout.propTypes = {
  children: PropTypes.node,
};
export default Layout;
