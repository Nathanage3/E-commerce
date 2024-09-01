import { useContext } from 'react';
import CartItems from '../../components/Cart/CartItems';
import Layout from '../../components/Layout';
import { AppContext } from '../../contexts/AppContext';
import './CartPage.css';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import CourseCard from '../../components/CourseCard/CourseCard';
import { courseData } from '../../fakeData';
import { settings } from '../../utils/sliderSetting.jsx';
const CartPage = () => {
  const { cartItems } = useContext(AppContext);

  return (
    <Layout>
      <div className="cart_page">
        <h1 className="cart_page_header">Shopping Cart</h1>

        <div className="cart_page_content">
          <div className="cart_page_c_content">
            <div className="cp_counter">
              {cartItems.length}
              {cartItems.length > 1 ? ' Courses' : ' Course'} in cart
            </div>
            <CartItems />
            {cartItems.length > 0 ? (
              <Link to={'/checkout'} className="checkout_link">
                Checkout
              </Link>
            ) : (
              <Link to={'/'} className="checkout_link">
                Browse Courses
              </Link>
            )}
          </div>
          <div className="cart_page_courses">
            <h2 className="home_c_header">You might also like</h2>
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
