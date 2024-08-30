import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home/Home';
import CourseList from './screens/CourseList';
import Login from './screens/AuthPages/Login';
import Signup from './screens/AuthPages/Signup';
import CourseDescription from './screens/CourseDescription/CourseDescription';
import CartPage from './screens/CartPage/CartPage';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/courses/:id" element={<CourseDescription />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
