import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '../assets/search-icon.svg';
const Header = () => {
  let [searchTerm, setSearchTerm] = useState('');
  return (
    <header className="header">
      <div className="logo">LOGO</div>
      <div>
        <button>Categories</button>
      </div>
      <div className="search_bar">
        <form className='search_form'>
          <button type='submit' className="search_icon">
            <img src={SearchIcon} alt="search icon" className="" />
          </button>
          <input
            type="text"
            placeholder="Search for Anything"
            name="searchTerm"
            id="searchbar"
            onChange={(e) => setSearchTerm(e.target.value)}
            className=""
            value={searchTerm}
          />
        </form>
      </div>
      <div>
        <button>Sell Courses</button>
      </div>
      <div>
        <button>Cart</button>
      </div>
      <div>
        <Link to={'/auth'}>LOGIN</Link>
      </div>
      <div>
        <Link to={'/auth'}>SIGN UP</Link>
      </div>
    </header>
  );
};

export default Header;
