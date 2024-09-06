import { useState } from 'react';
import { categoriesData } from '../../fakeData';
import './SellCourse.css';

const SellCourse = () => {
  const [selectedTime, setSelectedTime] = useState('');

  const handleChange = (event) => {
    setSelectedTime(event.target.value);
  };
  return (
    <div className="sell_course_page">
      <h1>Courses</h1>
      <div className="create_c_form">
        <label htmlFor="title">Course Title</label>
        <input type="text" name="" id="title" />

        <h2>category </h2>
        <select className="side_nav_cats">
          {categoriesData.map((item, id) => (
            <option key={id}>
              <div className="side_nav_cat">{item.title}</div>
            </option>
          ))}
          <option>
            <div className="side_nav_cat">All Categories</div>
          </option>
        </select>
        <br />
        <h2>How much time can you spend creating your course per week?</h2>
        <div>
          <label>
            <input
              type="radio"
              value="1-2 hours"
              checked={selectedTime === '1-2 hours'}
              onChange={handleChange}
            />
            1-2 hours
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="3-5 hours"
              checked={selectedTime === '3-5 hours'}
              onChange={handleChange}
            />
            3-5 hours
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="6-10 hours"
              checked={selectedTime === '6-10 hours'}
              onChange={handleChange}
            />
            6-10 hours
          </label>
        </div>
        <div>
          <label>
            <input
              type="radio"
              value="More than 10 hours"
              checked={selectedTime === 'More than 10 hours'}
              onChange={handleChange}
            />
            More than 10 hours
          </label>
        </div>
        <button>Create New Course</button>
      </div>
    </div>
  );
};

export default SellCourse;
