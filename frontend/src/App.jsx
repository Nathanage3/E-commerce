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
import SellCourse from './screens/Instructor/SellCourse/SellCourse.jsx';
import MyCourses from './screens/MyCourses/MyCourses';
import AllCourses from './screens/MyCourses/AllCourses';
import Wishlist from './screens/MyCourses/Wishlist';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';
import UserAccount from './screens/UserAccount/UserAccount';
import ScrollToTop from './utils/scrollToTop.js';
import UserInfo from './screens/UserAccount/UserInfo.jsx';
import UserPhoto from './screens/UserAccount/UserPhoto.jsx';
import Instructor from './screens/Instructor/Instructor.jsx';
import UploadedCourses from './screens/Instructor/UploadedCourses/UploadedCourses.jsx';
import Earnings from './screens/Instructor/Earnings/Earnings.jsx';

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

        <Route path="/instructor" element={<Instructor />}>
          <Route index element={<Navigate to="uploaded-courses" replace />} />
          <Route path="uploaded-courses" element={<UploadedCourses />} />
          <Route path="uploaded-courses/:id" element={<CourseDescription />} />
          <Route path="create-new-course" element={<SellCourse />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<UserAccount />}>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<UserInfo />} />
            <Route path="photo" element={<UserPhoto />} />
          </Route>
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
