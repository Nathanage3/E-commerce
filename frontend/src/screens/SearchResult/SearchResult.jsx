import { useLocation } from 'react-router-dom';
import './SearchResult.css';

const SearchResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('q');

  return (
    <div className="sr_page">
      <h1>Search Results for: {searchTerm}</h1>
    </div>
  );
};

export default SearchResult;
