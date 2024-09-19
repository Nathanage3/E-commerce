import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const NavAuthLinks = () => {
  return (
    <div className="nav_auth_links">
      <Link to={'/login'} className="nav_btn login">
        <FontAwesomeIcon className="login_icon" icon={faRightToBracket} />
        Sign In
      </Link>
      <Link to={'/signup'} className="nav_btn register">
        Register
      </Link>
    </div>
  );
};

export default NavAuthLinks;
