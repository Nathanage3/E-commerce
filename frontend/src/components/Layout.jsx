/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import SideNav from './SideNav/SideNav';

const Layout = ({ children }) => {
  const { showNav } = useContext(AppContext);

  return (
    <div className={`App ${showNav ? 'modal_open' : ''}`}>
      {showNav && <SideNav />}
      <Header />
      <main className="main_content">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
};

export default Layout;
