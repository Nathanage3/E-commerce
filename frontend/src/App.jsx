import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import CourseList from './screens/CourseList';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';
import CourseDescription from './screens/CourseDescription/CourseDescription';
import CartPage from './screens/CartPage/CartPage';
import Checkout from './screens/Checkout';
import Notifications from './screens/Notifications';
import MyCourses from './screens/MyCourses/MyCourses';
import AllCourses from './screens/MyCourses/AllCourses';
import Wishlist from './screens/MyCourses/Wishlist';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDescription />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/my-courses" element={<MyCourses />}>
        <Route index element={<Navigate to="learning" replace />} />
        <Route path="learning" element={<AllCourses />} />
        <Route path="wishlist" element={<Wishlist />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
