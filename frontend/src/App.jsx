import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { Navigate } from 'react-router-dom';
import Home from './screens/Home/Home';
import CourseList from './screens/CourseList/CourseList';
import CourseCategory from './screens/CourseCategory/CourseCategory';
import CourseSubCategory from './screens/CourseCategory/CourseSubCategory';
import SearchResult from './screens/SearchResult/SearchResult';
import CourseDescription from './screens/CourseDescription/CourseDescription';
import CartPage from './screens/CartPage/CartPage';
import Checkout from './screens/Checkout';
import Notifications from './screens/Notifications/Notifications';
import SellCourse from './screens/SellCourse/SellCourse';
import MyCourses from './screens/MyCourses/MyCourses';
import AllCourses from './screens/MyCourses/AllCourses';
import Wishlist from './screens/MyCourses/Wishlist';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';
import UserAccount from './screens/UserAccount/UserAccount';
import ScrollToTop from './utils/scrollToTop.js';
import UserInfo from './screens/UserAccount/UserInfo.jsx';
import UserPhoto from './screens/UserAccount/UserPhoto.jsx';

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
      
        <Route exact path="/" element={<Home />} />
        <Route path="/courses" element={<CourseList />}>
          <Route path=":category" element={<CourseCategory />} />
          <Route
            path=":category/:subCategory"
            element={<CourseSubCategory />}
          />
          <Route path="search" element={<SearchResult />} />
        </Route>
        <Route path="/course/:id" element={<CourseDescription />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/notifications" element={<Notifications />} />

        <Route path="/sell-course" element={<SellCourse />}>
          <Route index element={<Navigate to="step-1" replace />} />
          <Route path="step-2" element={<AllCourses />} />
          <Route path="step-3" element={<Wishlist />} />
        </Route>
        <Route path="/my-courses" element={<MyCourses />}>
          <Route index element={<Navigate to="learning" replace />} />
          <Route path="learning" element={<AllCourses />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
        <Route path="/user" element={<UserAccount />}>
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<UserInfo />} />
          <Route path="photo" element={<UserPhoto />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />


      </Routes>
    </Layout>
  );
}

export default App;
