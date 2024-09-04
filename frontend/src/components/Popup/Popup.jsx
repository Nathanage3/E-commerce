import { Link } from 'react-router-dom';
import './Popup.css';
import PropTypes  from 'prop-types';

const Popup = ({ course, addType }) => {
  const { img, title, price } = course;

  return (
    <div className="add_to_cart_popup">
      <div className="popup_header">
        Course added to {addType === 'cart' ? 'Cart' : 'WishList'}!
      </div>
      <div className="pop_up_content">
        <div className="popup_image">
          <img src={img} alt="product" />
        </div>
        <div className="popup_detail">
          <div className="popup_title">{title}</div>
          <div className="popup_price">${price}</div>
        </div>
      </div>
      {addType === 'cart' ? (
        <Link className="pp_checkout_link" to="/checkout">
          Checkout
        </Link>
      ) : (
        <Link className="pp_checkout_link" to="/my-courses/wishlist">
          Go to WishList
        </Link>
      )}
    </div>
  );
};
Popup.propTypes = {
  course: PropTypes.object.isRequired,
  addType: PropTypes.string.isRequired,
};
export default Popup;
