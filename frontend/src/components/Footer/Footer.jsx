import { Link } from 'react-router-dom';
import './Footer.css';
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer_links">
        <div className="link_group">
          <ul>
            <li>
              <Link className='foot_link' to="/">Browse Courses</Link>
            </li>
            <li>
              <Link className='foot_link' to="/sell-course">Sell Course</Link>
            </li>
            <li>
              <Link className='foot_link' to="/">My courses</Link>
            </li>
            <li>
              <Link className='foot_link' to="/">Wishlist</Link>
            </li>
          </ul>
        </div>
        <div className="link_group">
          <ul>
            <li>
              <Link className='foot_link' to="/">About us</Link>
            </li>
            <li>
              <Link className='foot_link' to="/">Help and Support</Link>
            </li>
            <li>
              <Link className='foot_link' to="/">Terms</Link>
            </li>
            <li>
              <Link className='foot_link' to="/">Privacy policy</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer_end">© {new Date().getFullYear()} LOGO, Inc.</div>
    </footer>
  );
};

export default Footer;
