/* eslint-disable react/prop-types */
import Footer from "./Footer";
import Header from "./Header/Header";

const Layout = ({ children }) => {
  return (
    <div className="App">
      <Header />
      <div className="main_content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
