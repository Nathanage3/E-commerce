import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchTerm);
  };
  const handleSearch = (searchTerm) => {
    // Redirect to the search results page with query parameters
    navigate(`/courses/search?q=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <div className="search_bar">
      <form className="search_form" onSubmit={handleSubmit}>
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
