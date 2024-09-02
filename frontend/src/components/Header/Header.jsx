import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCartShopping,
  faHeart,
  faMagnifyingGlass,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../../hooks/useAuth';
import { FaBars } from 'react-icons/fa';
import Cart from '../Cart/Cart';
import SearchBar from './SearchBar/SearchBar';
import NavCategories from './NavCategories';
import { AppContext } from '../../contexts/AppContext';
import SmallNotification from './SmallNotification';
const Header = () => {
  // const { isAuthenticated } = useAuth();
  const { cartItems, handleOpenNavbar } = useContext(AppContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

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
      <div className="nav_right">
        <div className="always_on">
          <div className="sell_nav">
            <Link className="nav_link" to={'/sell-course'}>
              Sell Courses
            </Link>
          </div>
          <div
            className="cart_nav center"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link to={'/cart'} className="center">
              <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
            </Link>
            {cartItems && (
              <span className="cart_counter center">{cartItems.length}</span>
            )}
            {isCartOpen && <Cart />}
          </div>
          <div className="center">
            <Link to={'/my-courses/wishlist'} className="center">
              <FontAwesomeIcon className="icon_heart" icon={faHeart} />
            </Link>
          </div>
        </div>
        <div className="center">
          <Link to={'/my-courses'} className="nav_link" title="My Courses">
            My Courses
          </Link>
        </div>
        <div className="always_on">
          <div
            className="bell_icon_wrapper center"
            onMouseEnter={() => setIsNotificationOpen(true)}
            onMouseLeave={() => setIsNotificationOpen(false)}
          >
            <Link
              to={'/notifications'}
              className="center"
              title="Notifications"
            >
              <FontAwesomeIcon className="icon_bell" icon={faBell} />
            </Link>
            <span className="notification_counter center">0</span>
            {isNotificationOpen && <SmallNotification />}
          </div>
          <div>
            <Link to={'/user'} className="nav_btn register">
              <FontAwesomeIcon icon={faUser} />
            </Link>
          </div>
        </div>
        {/* <div className="nav_auth_links">
          <Link to={'/login'} className="nav_btn login">
            <FontAwesomeIcon className="login_icon" icon={faRightToBracket} />
            Sign In
          </Link>
          <Link to={'/signup'} className="nav_btn register">
            Register
          </Link>
        </div> */}
      </div>
      <div className="on_small_screen">
        <div className="search_nav center">
          <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
        </div>

        <div className="cart_nav center">
          <Link to={'/cart'} className="center">
            <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
          </Link>
          {cartItems && (
            <span className="cart_counter center">{cartItems.length}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
