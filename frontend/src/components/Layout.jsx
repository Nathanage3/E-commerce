/* eslint-disable react/prop-types */
import Footer from "./Footer";
import Header from "./Header/Header";

const Layout = ({ children }) => {
  return (
    <div className="App">
      <Header />
      <main className="main_content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
