import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
const SearchBar = ({ show }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.value !== '') {
      handleSearch(searchTerm);
    }
  };
  const handleSearch = (searchTerm) => {
    navigate(`/courses/search?q=${encodeURIComponent(searchTerm)}`);
  };
  return (
    <div className={`${show ? 'sm_scrn_search' : 'search_bar'}`}>
      <form className="search_form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search for Anything . . ."
          name="searchTerm"
          id="searchbar"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <button type="submit" className="search_icon center">
          <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
        </button>
      </form>
    </div>
  );
};
SearchBar.propTypes = {
  show: PropTypes.bool,
};
export default SearchBar;
