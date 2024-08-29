/* eslint-disable react/prop-types */
import './CourseCard.css';
const CourseCard = ({ course }) => {
  let totalRating = (
    (1 * course.stars?.a +
      2 * course.stars?.b +
      3 * course.stars?.c +
      4 * course.stars?.d +
      5 * course.stars?.e) /
      course.stars?.a +
    course.stars?.b +
    course.stars?.c +
    course.stars?.d +
    course.stars?.e
  ).toFixed(2);

  let duration = new Date(course.courseDuration * 1000);
  let hours = duration.getUTCHours();
  let minutes = duration.getUTCMinutes();

  let durationInHrs =
    hours?.toString().padStart(2, '0') +
    '.' +
    minutes?.toString().padStart(1, '0');
  return (
    <article className='course_card'>
      <div className="">
        <img src={course.img} alt="course thumbnail" className="" />
      </div>
      <div className="">
        <div className="">{course.title}</div>
        <div className="">{course.info}</div>
        <div className="">
          <div className="">{totalRating}</div>
          <div className="">{totalRating}</div>
          <div className="">({course.ratingCount})</div>
        </div>
        <div className="">
          <span className="">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(course.price)}
          </span>
          <span className="">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(course.oldPrice)}
          </span>
        </div>
        <div className="">{durationInHrs} total hours</div>
        <div>BEST SELLER</div>
      </div>
    </article>
  );
};

export default CourseCard;
