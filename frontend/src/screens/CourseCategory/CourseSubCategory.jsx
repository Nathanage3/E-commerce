import { useParams } from 'react-router-dom';

const CourseSubCategory = () => {
    const { subCategory } = useParams();
    return (
      <div className="courses_cat_comp">
        <h1>{subCategory} Courses</h1>
      </div>
    );
}

export default CourseSubCategory