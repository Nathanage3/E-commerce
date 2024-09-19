import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import SmallNotification from './SmallNotification/SmallNotification';
import {
  faBell,
  faCartShopping,
  faHeart,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import WishlistDropdown from './WishlistDropdown';
import { Link } from 'react-router-dom';
import Cart from '../Cart/Cart';
import { useAuth } from '../../hooks/useAuth';
import { AppContext } from '../../contexts/AppContext';
import NavAuthLinks from './NavAuthLinks';
import DropDownWrapper from './DropDownWrapper';
import useDropdown from '../../hooks/useDropdown';

const NavActions = () => {
  const { isAuthenticated } = useAuth();
  const { cartItems, toggleUserDropdown } = useContext(AppContext);
  const [isCartOpen, toggleCart] = useDropdown();
  const [isWishOpen, toggleWish] = useDropdown();
  const [isNotificationOpen, toggleNotification] = useDropdown();

  return (
    <div className="nav_right">
      <div className="always_on">
        <div className="sell_nav">
          <Link className="nav_link" to={'/instructor'}>
            Instructor
          </Link>
        </div>
        <DropDownWrapper
          isOpen={isCartOpen}
          toggleDropdown={toggleCart}
          title="Cart"
          icon={faCartShopping}
          link="/cart"
        >
          {cartItems && (
            <span className="cart_counter center">{cartItems.length}</span>
          )}
          {isCartOpen && <Cart />}
        </DropDownWrapper>
        {isAuthenticated && (
          <DropDownWrapper
            isOpen={isWishOpen}
            toggleDropdown={toggleWish}
            title="Wishlist"
            icon={faHeart}
            link="/my-courses/wishlist"
          >
            {isWishOpen && <WishlistDropdown />}
          </DropDownWrapper>
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
          <DropDownWrapper
            isOpen={isNotificationOpen}
            toggleDropdown={toggleNotification}
            title="Notifications"
            icon={faBell}
            link="/notifications"
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
      )}
      {!isAuthenticated && <NavAuthLinks />}
    </div>
  );
};

export default NavActions;
