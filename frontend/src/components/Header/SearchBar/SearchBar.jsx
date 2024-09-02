import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
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
  );
};

export default SearchBar;
