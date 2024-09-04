import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCartShopping,
  faHeart,
  faMagnifyingGlass,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
import { FaBars } from 'react-icons/fa';
import Cart from '../Cart/Cart';
import SearchBar from './SearchBar/SearchBar';
import NavCategories from './NavCategories';
import { AppContext } from '../../contexts/AppContext';
import SmallNotification from './SmallNotification';
import WishlistDropdown from './WishlistDropdown';
import { MdClose } from 'react-icons/md';
const Header = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, handleOpenNavbar } = useContext(AppContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishOpen, setIsWishOpen] = useState(false);
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
            <Link to={'/cart'} className="center" title="Cart">
              <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
            </Link>
            {cartItems && (
              <span className="cart_counter center">{cartItems.length}</span>
            )}
            {isCartOpen && <Cart />}
          </div>
          {isAuthenticated && (
            <div
              className="wishlist_nav center"
              onMouseEnter={() => setIsWishOpen(true)}
              onMouseLeave={() => setIsWishOpen(false)}
            >
              <Link
                to={'/my-courses/wishlist'}
                className="center"
                title="WishList"
              >
                <FontAwesomeIcon className="icon_heart" icon={faHeart} />
              </Link>
              {isWishOpen && <WishlistDropdown />}
            </div>
          )}
        </div>
        {isAuthenticated && (
          <div className="center">
            <Link to={'/my-courses'} className="nav_link" title="My Courses">
              My Courses
            </Link>
          </div>
        )}
        {isAuthenticated && (
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
            <div className="nav_user_btn center">
              <Link to={'/user'} className='center' >
                <FontAwesomeIcon icon={faUser} className='icon_avatar' />
              </Link>
            </div>
          </div>
        )}
        {!isAuthenticated && (
          <div className="nav_auth_links">
            <Link to={'/login'} className="nav_btn login">
              <FontAwesomeIcon className="login_icon" icon={faRightToBracket} />
              Sign In
            </Link>
            <Link to={'/signup'} className="nav_btn register">
              Register
            </Link>
          </div>
        )}
      </div>
      <div className="on_small_screen">
        {isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(false)}
            className="sm_scrn_close_srch_btn center"
          >
            <MdClose className="icon_close_srch" />
          </button>
        ) : (
          <div
            className="search_nav center"
            onClick={() => setIsSearchOpen(true)}
          >
            <FontAwesomeIcon className="icon_search" icon={faMagnifyingGlass} />
          </div>
        )}

        <div className="cart_nav center">
          <Link to={'/cart'} className="center">
            <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
          </Link>
          {cartItems && (
            <span className="cart_counter center">{cartItems.length}</span>
          )}
        </div>
      </div>
      {isSearchOpen && <SearchBar show={true} />}
    </header>
  );
};

export default Header;
