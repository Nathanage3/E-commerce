import { useContext } from 'react';
import './Cart.css';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import CartItems from './CartItems';

const Cart = () => {
  const { cartItems } = useContext(AppContext);
 
  return (
    <div className="cart_drop_down">
      <p className="cart_header">Cart</p>

      <div className="cart_content">
        {!cartItems ||
          (cartItems.length < 1 && (
            <span className="empty_cart_txt">Your cart is empty</span>
          ))}
        {cartItems && cartItems.length > 0 && <CartItems />}
       
      </div>

      {cartItems && cartItems.length > 0 && (
        <Link className="cart_page_link" to="/cart">
          Go To Cart
        </Link>
      )}
    </div>
  );
};

export default Cart;
