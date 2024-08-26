import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import CourseList from './screens/CourseList';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
