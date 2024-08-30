import { useState } from 'react';
import { categoriesData } from '../../fakeData';

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
  );
};

export default NavCategories;
