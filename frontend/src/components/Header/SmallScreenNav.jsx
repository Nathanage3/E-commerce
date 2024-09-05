import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCartShopping,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { MdClose } from 'react-icons/md';
import { useContext, useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import { AppContext } from '../../contexts/AppContext';

const SmallScreenNav = () => {
  const { cartItems } = useContext(AppContext);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <>
      <div className="on_small_screen">
        {isSearchOpen ? (
          <button
            onClick={() => setIsSearchOpen(false)}
            className="sm_scrn_close_srch_btn center"
          >
            <MdClose className="icon_close_srch" />
          </button>
        ) : (
          <div
            className="search_nav center"
            onClick={() => setIsSearchOpen(true)}
          >
            <FontAwesomeIcon className="icon_search" icon={faMagnifyingGlass} />
          </div>
        )}

        <div className="dropdown_nav center">
          <Link to={'/cart'} className="center">
            <FontAwesomeIcon className="icon_cart" icon={faCartShopping} />
          </Link>
          {cartItems && (
            <span className="sm_scrn_cart_counter center">{cartItems.length}</span>
          )}
        </div>
      </div>
      {isSearchOpen && <SearchBar show={true} />}
    </>
  );
};

export default SmallScreenNav;
