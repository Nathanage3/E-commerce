import Layout from '../../components/Layout';
import Banner from '../../assets/banner3.jpg';
import './Home.css';
import { courseData } from '../../fakeData';
import CourseCard from '../../components/CourseCard/CourseCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Home = () => {
 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 6,
    
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
          <h2 className="home_c_header">Best Sellers</h2>
          <Slider {...settings}>
            {courseData.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </Slider>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
