import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCartShopping,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
// import { useAuth } from '../../hooks/useAuth';
import Cart from '../Cart/Cart';
import SearchBar from './SearchBar';
import NavCategories from './NavCategories';
import { AppContext } from '../../contexts/AppContext';
const Header = () => {
  // const { isAuthenticated } = useAuth();
  const { cartItems } = useContext(AppContext);

  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="header">
      <div className="logo">
        <Link className="home_link" to={'/'}>
          LOGO
        </Link>
      </div>
      <NavCategories />
      <SearchBar />
      <div className="nav_right">
        <div className="always_on">
          <div className='center'>
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
                <span className="cart_counter">{cartItems.length}</span>
              )}
            {isCartOpen && <Cart />}
          </div>
          <div className="center">
            <Link to={'/wishlist'} className="center">
              <FontAwesomeIcon className="icon_heart" icon={faHeart} />
            </Link>
          </div>
        </div>
        <div className="always_on">
          <div className="center">
            <Link
              to={'/notifications'}
              className="bell_icon_wrapper center"
              title="Notifications"
            >
              <FontAwesomeIcon className="icon_bell" icon={faBell} />

              <span className='notification_counter center'>0</span>
            </Link>
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
    </header>
  );
};

export default Header;
