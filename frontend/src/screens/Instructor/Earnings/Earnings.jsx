import './Earnings.css';
import { InstCourse } from '../../../fakeData';

const Earnings = () => {
  const instructorData = {
    coursesSold: 0,
    studentsEnrolled: 0,
    totalEarnings: '$0.00',
    averageRating: 'N/A',
    coursesOffered: InstCourse.length,
    feedbackReceived: 0,
  };
  return (
    <div className="earnings_content">
      <div className="inst_content_hdr">Instructor Earnings</div>

      <table>
        <thead>
          <tr>
            <th>Instructor Stats</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="keys">Courses Offered</td>
            <td className="vals">{instructorData.coursesOffered}</td>
          </tr>
          <tr>
            <td className="keys">Courses Sold</td>
            <td className="vals">{instructorData.coursesSold}</td>
          </tr>
          <tr>
            <td className="keys">Students Enrolled</td>
            <td className="vals">{instructorData.studentsEnrolled}</td>
          </tr>
          <tr>
            <td className="keys">Average Rating</td>
            <td className="vals">{instructorData.averageRating}</td>
          </tr>
          <tr>
            <td className="keys">Feedback Received</td>
            <td className="vals">{instructorData.feedbackReceived}</td>
          </tr>
          <tr>
            <td className="keys">Total Earnings</td>
            <td className="vals">{instructorData.totalEarnings}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Earnings;
