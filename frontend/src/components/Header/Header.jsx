import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { categoriesData } from '../../fakeData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faCartShopping,
  faHeart,
  faMagnifyingGlass,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../hooks/useAuth';
const Header = () => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState({});

  const toggleSubDropdown = (id) => {
    setSubDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <header className="header">
      <div className="logo"><Link className='home_link' to={'/'}>LOGO</Link></div>
      <div
        className="categories_nav center"
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        Categories
        {isDropdownOpen && (
          <ul className="categories_dropdown">
            {categoriesData.map((item, id) => (
              <li
                className="parent_category"
                key={id}
                onMouseEnter={() => toggleSubDropdown(id)}
                onMouseLeave={() => toggleSubDropdown(id)}
              >
                {item.title}
                {subDropdownOpen[id] && (
                  <ul className="sub_dropdown">
                    {item.sub.map((subItem, id) => (
                      <li key={id}>{subItem.title}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="search_bar">
        <form className="search_form">
          <button type="submit" className="search_icon center">
            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
          </button>
          <input
            type="text"
            placeholder="Search for Anything . . ."
            name="searchTerm"
            id="searchbar"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </form>
      </div>
      <div className="nav_right">
        <div>
          <Link className="nav_link" to={'/sell-course'}>
            Sell Courses
          </Link>
        </div>
        <div className="nav_right_most">
          <div>
            <Link to={'/cart'}>
              <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
            </Link>
          </div>
          {!isAuthenticated && (
            <>
              <div>
                <Link to={'/wishlist'}>
                  <FontAwesomeIcon className="icon_heart" icon={faHeart} />
                </Link>
              </div>
              <div>
                <Link
                  to={'/notifications'}
                  className="bell_icon_wrapper"
                  title="Notifications"
                >
                  <FontAwesomeIcon className="icon_bell" icon={faBell} />

                  <span className={`notification_counter`}>0</span>
                </Link>
              </div>
            </>
          )}
          {isAuthenticated ? (
            <div className="nav_auth_links">
              <Link to={'/login'} className="nav_btn login">
                <FontAwesomeIcon
                  className="login_icon"
                  icon={faRightToBracket}
                />
                Sign In
              </Link>
              <Link to={'/signup'} className="nav_btn register">
                Register
              </Link>
            </div>
          ) : (
            <div>
              <Link to={'/user'} className="nav_btn register">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
