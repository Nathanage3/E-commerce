import { useContext } from 'react';
import './Header.css';
import { FaBars } from 'react-icons/fa';
import SearchBar from './SearchBar/SearchBar';
import NavCategories from './NavCategories';
import { AppContext } from '../../contexts/AppContext';
import NavActions from './NavActions';
import SmallScreenNav from './SmallScreenNav';
import SmallUserProfile from '../UserProfile/SmallUserProfile';
const Header = () => {
  const { handleOpenNavbar, isUserDropDownOpen } = useContext(AppContext);

  return (
    <header className="header">
      <button className="nav_menu_btn" onClick={handleOpenNavbar}>
        <FaBars className="icon_menu" />
      </button>
      <div className="logo">
        <a className="home_link" href={'/'}>
          LOGO
        </a>
      </div>
      <NavCategories />
      <SearchBar />
      <NavActions />
      <SmallScreenNav />
      {isUserDropDownOpen && <SmallUserProfile />}
    </header>
  );
};

export default Header;
