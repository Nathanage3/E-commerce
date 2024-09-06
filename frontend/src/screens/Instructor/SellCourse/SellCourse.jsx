import { useState } from 'react';
import { categoriesData } from '../../../fakeData';
import './SellCourse.css';

const SellCourse = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const totalSteps = 8;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };
  return (
    <div className="sell_crs_content">
      <form className="create_crs_form">
        {currentStep === 0 && (
          <div className="splitter br_btm">
            <div className="half">
              <div className="sc_form_group">
                <label htmlFor="category">Choose a category</label>
                <select className="crs_cat" id="category">
                  {categoriesData.map((item, id) => (
                    <option value={item.title} key={id}>
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="half">
              <div className="sc_form_group">
                <label htmlFor="title">Course Title</label>
                <input type="text" name="" id="title" />
              </div>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div className="div">
            <div className="sc_form_group">
              <label htmlFor="subTitle">
                Write a short sub-title for your course.
              </label>
              <input type="text" name="subTitle" id="subTitle" />
            </div>
            <div className="sc_form_group br_btm">
              <label htmlFor="descrtiption">
                Describe your course in less than 50 words.
              </label>
              <input type="text" name="descrtiption" id="descrtiption" />
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div className="sc_form_group br_btm">
            <div className="sc_label">
              What will students learn in your course?
            </div>
            <div>
              You must enter at least 4 learning objectives or outcomes that
              learners can expect to achieve after completing your course.
            </div>

            <small className="src_sml_txt">
              These descriptions will help learners decide if your course is
              right for them.
            </small>
            <label htmlFor="description">Write atleast 4 Objectives</label>
            <div className="sc_desc_inputs">
              <input
                type="text"
                name="description"
                id="description"
                maxLength={150}
              />
              <input
                type="text"
                name="description"
                id="description"
                maxLength={150}
              />
              <input
                type="text"
                name="description"
                id="description"
                maxLength={150}
              />
              <input
                type="text"
                name="description"
                id="description"
                maxLength={150}
              />
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div className="sc_form_group br_btm">
            <label htmlFor="prerequisites">
              What are the requirements or prerequisites for taking your course?
            </label>
            <p>
              List the required skills, experience, tools or equipment learners
              should have prior to taking your course.
            </p>
            <p>
              If there are no requirements, use this space as an opportunity to
              lower the barrier for beginners.
            </p>
            <input type="text" name="prerequisites" id="prerequisites" />
          </div>
        )}
        {currentStep === 4 && (
          <div>
            <div className="sc_form_group br_btm">
              <label htmlFor="title">Who is this course for?</label>
              <p>
                Write a clear description of the intended learners for your
                course who will find your course content valuable.
              </p>
              <small className="src_sml_txt">
                This will help you attract the right learners to your course.
              </small>
              <input type="text" name="" id="title" />
            </div>
            <div className="sc_form_group">
              <label htmlFor="level">Select Level</label>
              <select className="crs_cat" id="level">
                <option value="beginner">Beginner Level</option>
                <option value="intermidiate">Intermidiate Level</option>
                <option value="expert">Expert Level</option>
                <option value="all">All Levels</option>
              </select>
            </div>
          </div>
        )}
        {currentStep === 5 && (
          <div className="sc_form_group br_btm">
            <label htmlFor="videoUpload">
              <span className="upload_btn">Upload</span> Course Video
            </label>
            <input
              type="file"
              id="videoUpload"
              accept="video/*"
              onChange={handleVideoChange}
            />
            {videoFile ? (
              <p>Video selected: {videoFile.name}</p>
            ) : (
              <p>No Video selected</p>
            )}
          </div>
        )}
        {currentStep === 6 && (
          <div className="sc_form_group br_btm">
            <label htmlFor="imageUpload">
              <span className="upload_btn">Upload </span>Course Image
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageFile ? (
              <p>Image selected: {imageFile.name}</p>
            ) : (
              <p>No Image selected</p>
            )}
          </div>
        )}
        {currentStep === 7 && (
          <div className="sc_form_group br_btm">
            <p>Set a price for your course.</p>
            <div className="splitter">
              <div className="half">
                <div className="sc_form_group">
                  <label htmlFor="currency">Currency</label>
                  <select className="crs_cat" id="currency">
                    <option value="USD">USD</option>
                    <option value="ETB">ETB</option>
                  </select>
                </div>
              </div>
              <div className="half">
                <div className="sc_form_group">
                  <label htmlFor="price">Price</label>
                  <input type="number" name="price" step={0.1} id="price" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="sc_navigation">
          {currentStep > 0 && (
            <button type="button" onClick={prevStep}>
              Previous
            </button>
          )}
          {currentStep < totalSteps - 1 ? (
            <button type="button" onClick={nextStep}>
              Next
            </button>
          ) : (
            <button type="button">Create New Course</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SellCourse;
