import { Link } from 'react-router-dom';
import './SideNav.css';
import { MdClose } from 'react-icons/md';
import { categoriesData } from '../../fakeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

const SideNav = () => {
  const { handleCloseNavbar } = useContext(AppContext);
  return (
    <div className="side_nav_modal">
      <div className="side_nav_content">
        <button onClick={handleCloseNavbar} className="close_nav_btn center">
          <MdClose className="icon" />
        </button>
        <div className="side_nav_header">Popular categoires</div>
        <div></div>
        <ul className="side_nav_cats">
          {categoriesData.map((item, id) => (
            <li key={id}>
              <Link className="side_nav_cat" to={`/courses/${item.title}`}>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
        <div className="saell_nav">
          <Link className="nav_link" to={'/sell-course'}>
            Sell Courses
          </Link>
        </div>
        <div className="ceanter">
          <Link to={'/my-courses'} className="nav_link" title="My Courses">
            My Courses
          </Link>
        </div>
        <div className="ceanter">
          <Link to={'/my-courses/wishlist'} className="center">
            <FontAwesomeIcon className="icon_heart" icon={faHeart} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
