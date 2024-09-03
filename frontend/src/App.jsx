import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import CourseList from './screens/CourseList';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';
import CourseDescription from './screens/CourseDescription/CourseDescription';
import CartPage from './screens/CartPage/CartPage';
import Checkout from './screens/Checkout';
import Notifications from './screens/Notifications/Notifications';
import MyCourses from './screens/MyCourses/MyCourses';
import AllCourses from './screens/MyCourses/AllCourses';
import Wishlist from './screens/MyCourses/Wishlist';
import CourseCategory from './screens/CourseCategory/CourseCategory';
import Layout from './components/Layout';
import CourseSubCategory from './screens/CourseCategory/CourseSubCategory';
import SellCourse from './screens/SellCourse/SellCourse';
import SearchResult from './screens/SearchResult/SearchResult';
import UserProfile from './screens/UserProfile/UserProfile';

function App() {
  return (
    <Layout>
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
        <Route path="/sell-course" element={<SellCourse />} />

        <Route path="/my-courses" element={<MyCourses />}>
          <Route index element={<Navigate to="learning" replace />} />
          <Route path="learning" element={<AllCourses />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
        <Route path="/user" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
}

export default App;
