import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <div className="footer_links">
          <div className="link_group">
            <ul>
              <li>
                <Link to="/">Bussiness</Link>
              </li>
              <li>
                <Link to="/">Teach</Link>
              </li>
              <li>
                <Link to="/">Get the app</Link>
              </li>
              <li>
                <Link to="/">About us</Link>
              </li>
              <li>
                <Link to="/">Contact us</Link>
              </li>
            </ul>
          </div>
          <div className="link_group">
            <ul>
              <li>
                <Link to="/">Carrers</Link>
              </li>
              <li>
                <Link to="/">Blog</Link>
              </li>
              <li>
                <Link to="/">Help and Support</Link>
              </li>
              <li>
                <Link to="/">Affiliate</Link>
              </li>
              <li>
                <Link to="/">Investors</Link>
              </li>
            </ul>
          </div>
          <div className="link_group">
            <ul>
              <li>
                <Link to="/">Terms</Link>
              </li>
              <li>
                <Link to="/">Privacy policy</Link>
              </li>
              <li>
                <Link to="/">Cookie settings</Link>
              </li>
              <li>
                <Link to="/">Sitemap</Link>
              </li>
              <li>
                <Link to="/">Accessibility statement</Link>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <div></div>
          <div>© {new Date().getFullYear()} LOGO, Inc.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
