import { useLocation } from 'react-router-dom';
import './SearchResult.css';

const SearchResult = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get('q');

  return (
    <div className="sr_page">
      <div className="sr_page_content">
      <h1>Search Results for: {searchTerm}</h1>

      </div>
    </div>
  );
};

export default SearchResult;
