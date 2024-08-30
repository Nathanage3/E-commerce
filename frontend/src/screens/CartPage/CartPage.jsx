import { useContext } from 'react';
import CartItems from '../../components/Cart/CartItems';
import Layout from '../../components/Layout';
import { AppContext } from '../../contexts/AppContext';
import './CartPage.css';

const CartPage = () => {
    const { cartItems } = useContext(AppContext);
    // const handleRemoveFromCart = (id) => {
    //   removeFromCart(id);
    // };
  return (
    <Layout>
      <div className="cart_page">
        <h1 className='cart_page_header'>Shopping Cart</h1>
        <div className='cp_counter'>{cartItems.length} courses in cart</div>
        <div className='cart_page_content'>

        <CartItems />
        </div>
        </div>
    </Layout>
  );
};

export default CartPage;
