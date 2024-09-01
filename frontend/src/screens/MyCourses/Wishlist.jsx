import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard/CourseCard';

const Wishlist = () => {
  const { wishItems } = useContext(AppContext);
  return (
    <div className="wishlist_content">
      {wishItems.length > 0 ? (
        <div className="wish_listing">
          {wishItems.map((item) => (
            <CourseCard key={item.id} course={item} />
          ))}
        </div>
      ) : (
        <div className="no_cc">
          <p className="acc_p">
            When you add a course to wishlist, it will appear here.
          </p>
          <Link className="browse_link" to="/">
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
