import { useState } from 'react';
import { categoriesData } from '../../fakeData';
import { Link } from 'react-router-dom';

const NavCategories = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subDropdownOpen, setSubDropdownOpen] = useState({});

  const toggleSubDropdown = (id) => {
    setSubDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  return (
    <div
      className="categories_nav"
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
              <Link
                className="cat_nav_link"
                to={`/courses/${item.title}`}
                onClick={() => setIsDropdownOpen(false)}
              >
                {item.title}
              </Link>
              {subDropdownOpen[id] && (
                <ul className="sub_dropdown">
                  {item.sub.map((subItem, id) => (
                    <li key={id} className="child_category">
                      <Link
                        onClick={() => setIsDropdownOpen(false)}
                        className="sub_cat_nav_link"
                        to={`/courses/${item.title}/${subItem.title}`}
                      >
                        {' '}
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NavCategories;
