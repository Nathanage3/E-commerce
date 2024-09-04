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
import UserProfile from './screens/UserProfile/UserProfile';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';

const routes = [
  { path: '/', element: <Home /> },
  {
    path: '/courses',
    element: <CourseList />,
    children: [
      { path: ':category', element: <CourseCategory /> },
      { path: ':category/:subCategory', element: <CourseSubCategory /> },
      { path: 'search', element: <SearchResult /> },
    ],
  },
  { path: '/course/:id', element: <CourseDescription /> },
  { path: '/cart', element: <CartPage /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/notifications', element: <Notifications /> },
  { path: '/sell-course', element: <SellCourse /> },
  {
    path: '/my-courses',
    element: <MyCourses />,
    children: [
      { index: true, element: <Navigate to="learning" replace /> },
      { path: 'learning', element: <AllCourses /> },
      { path: 'wishlist', element: <Wishlist /> },
    ],
  },
  { path: '/user', element: <UserProfile /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
];

export default routes;
