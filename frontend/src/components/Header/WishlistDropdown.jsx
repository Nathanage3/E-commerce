import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import Items from '../Cart/Items';

const WishlistDropdown = () => {
  const { wishItems } = useContext(AppContext);
  return (
    <div className="wl_drop_down">
      <p className="cart_header">Wishlist</p>
      <div className="cart_content">
        {!wishItems ||
          (wishItems.length < 1 && (
            <span className="empty_cart_txt">Your Wishlist is empty</span>
          ))}
        {wishItems && wishItems.length > 0 && (
          <Items items={wishItems} itemType="wish" />
        )}
      </div>

      {wishItems && wishItems.length > 0 && (
        <Link className="cart_page_link" to="/cart">
          Go To Wishlist
        </Link>
      )}
    </div>
  );
};

export default WishlistDropdown;
