import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const DropDownWrapper = ({ toggleDropdown, title, icon, link, children }) => {
  return (
    <div
      className="dropdown_nav center"
      onMouseEnter={toggleDropdown}
      onMouseLeave={toggleDropdown}
    >
      <Link to={link} className="center" title={title}>
        <FontAwesomeIcon className={`icon_${title.toLowerCase()}`} icon={icon} />
      </Link>
      {children}
    </div>
  );
};

DropDownWrapper.propTypes = {
  toggleDropdown: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired,
  children: PropTypes.node,
};
export default DropDownWrapper;
