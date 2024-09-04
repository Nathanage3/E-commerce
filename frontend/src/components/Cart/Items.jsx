import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const Items = ({ items, itemType }) => {
  const { cartItems, removeFromCart, removeFromWish, addToCart } =
    useContext(AppContext);
  const handleRemoveFromCart = (id) => {
    removeFromCart(id);
  };
  const handleRemoveFromWish = (id) => {
    removeFromWish(id);
  };
  const handleFromWishToCart = (item) => {
    handleRemoveFromWish(item.id);
    addToCart(item);
  };
  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    return total.toFixed(2);
  };
  return (
    <>
      <ul className="cart_items_list">
        {items.map((item) => (
          <div key={item.id} className="cc_wl_item">
            <li className="cart_item">
              <div className="item_image">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="item_details">
                <span className="item_title">{item.title}</span>
                <div className="item_price_details">
                  <span className="item_price">${item.price}</span>
                  <span className="item_old_price">${item.oldPrice}</span>
                </div>
              </div>
              <button
                onClick={
                  itemType === 'cart'
                    ? () => handleRemoveFromCart(item.id)
                    : () => handleRemoveFromWish(item.id)
                }
                className="remove_from_cart_btn"
              >
                <FontAwesomeIcon className="icon_trash" icon={faXmark} />
              </button>
            </li>
            {itemType === 'wish' && (
              <button
                onClick={() => handleFromWishToCart(item)}
                className="wl_dd_atc_btn"
              >
                Add to cart
              </button>
            )}
          </div>
        ))}
      </ul>
      {itemType === 'cart' && (
        <div className="cart_total">
          Total: <span className="total_price">${calculateTotal()}</span>
        </div>
      )}
    </>
  );
};
Items.propTypes = {
  items: PropTypes.array,
  itemType: PropTypes.string,
};
export default Items;
