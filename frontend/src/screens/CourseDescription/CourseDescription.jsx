import { useParams } from 'react-router-dom';
import './CourseDescription.css';
import Layout from '../../components/Layout';
// import { useContext } from 'react';
// import { AppContext } from '../../contexts/AppContext';

const CourseDescription = () => {
  const { id } = useParams();
  //   const { addToCart } = useContext(AppContext);

  return (
    <Layout>
      <div className='course_desc_page'>
        <h1>CourseDescription </h1>
        <h1>Course Id: {id}</h1>
      </div>
    </Layout>
  );
};

export default CourseDescription;
