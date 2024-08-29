import Layout from '../../components/Layout';
import Banner from '../../assets/banner3.jpg';
import './Home.css';
import { courseData } from '../../fakeData';
import CourseCard from '../../components/CourseCard/CourseCard';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Home = () => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 6,
    initialSlide: 0,
    lazyLoad: true,
    nextArrow: <button>next</button>,
    prevArrow: <button>previc</button>,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <Layout>
      <section className="home_page">
        <div className="banner_hero">
          <img src={Banner} alt="" />
          <div className="banner_float">
            <div className="home_banner_header">Start Learning Today!</div>
            <p>
              Take control of your career. Learn the latest skills in web
              development.
            </p>
          </div>
        </div>
        <div className="home_courses">
          <h2>Browse Courses</h2>
          <div className="sider_container">
            <Slider {...settings}>
              {courseData.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))}
            </Slider>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
