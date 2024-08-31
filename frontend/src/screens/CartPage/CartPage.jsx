import { useContext } from 'react';
import CartItems from '../../components/Cart/CartItems';
import Layout from '../../components/Layout';
import { AppContext } from '../../contexts/AppContext';
import './CartPage.css';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import CourseCard from '../../components/CourseCard/CourseCard';
import { courseData } from '../../fakeData';
import RightArrow from '../../assets/right-arrow.svg';
import LeftArrow from '../../assets/left-arrow.svg';
import SliderArrow from '../../components/SliderArrow';

const CartPage = () => {
  const { cartItems } = useContext(AppContext);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SliderArrow icon={RightArrow} />,
    prevArrow: <SliderArrow icon={LeftArrow} />,
  };
  return (
    <Layout>
      <div className="cart_page">
        <h1 className="cart_page_header">Shopping Cart</h1>
        <div className="cart_page_content">
          <div className="cp_counter">
            {cartItems.length}
            {cartItems.length > 1 ? ' Courses' : ' Course'} in cart
          </div>
          <CartItems />
          <Link to={'/checkout'} className="checkout_link">
            Checkout
          </Link>
        </div>
        <div className="home_courses">
          <h2 className="home_c_header">You might also like</h2>
          <Slider {...settings}>
            {courseData.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </Slider>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
