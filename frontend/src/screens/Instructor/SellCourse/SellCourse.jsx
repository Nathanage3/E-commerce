import { useState } from 'react';
import { categoriesData } from '../../../fakeData';
import './SellCourse.css';
// import axios from 'axios';

const SellCourse = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseCreated, setCourseCreated] = useState(false);
  const totalSteps = 9;
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    subTitle: '',
    objectives: ['', '', '', ''],
    description: '',
    prerequisites: '',
    courseFor: '',
    level: '',
    videoFile: null,
    imageFile: null,
    price: '',
    currency: '',
    sections: '',
    duration: '',
  });

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

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      objectives: newObjectives,
    }));
  };

  const handleVideoChange = (event) => {
    const filevid = URL.createObjectURL(event.target.files[0]);
    console.log(filevid);
    setFormData((prevData) => ({
      ...prevData,
      videoFile: event.target.files[0],
    }));
  };

  const handleImageChange = (event) => {
    const fileimg = URL.createObjectURL(event.target.files[0]);
    console.log(fileimg);
    setFormData((prevData) => ({
      ...prevData,
      imageFile: event.target.files[0],
    }));
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validateFormData = () => {
    const {
      category,
      title,
      subTitle,
      objectives,
      description,
      prerequisites,
      courseFor,
      level,
      videoFile,
      imageFile,
      price,
      currency,
    } = formData;

    if (
      !category ||
      !title ||
      !subTitle ||
      !description ||
      !prerequisites ||
      !courseFor ||
      !level ||
      !price ||
      !currency ||
      !videoFile ||
      !imageFile
    ) {
      return false;
    }

    if (objectives.some((objective) => !objective)) {
      return false;
    }

    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateFormData()) {
      alert('Please fill in all required fields.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.category);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subTitle', formData.subTitle);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('prerequisites', formData.prerequisites);

    formDataToSend.append('courseFor', formData.courseFor);
    formDataToSend.append('level', formData.level);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('currency', formData.currency);
    formData.objectives.forEach((objective, index) => {
      formDataToSend.append(`objective${index}`, objective);
    });
    if (formData.videoFile) {
      formDataToSend.append('videoFile', formData.videoFile);
    }
    if (formData.imageFile) {
      formDataToSend.append('imageFile', formData.imageFile);
    }

    // try {
    //   const response = await axios.post(
    //     'url',
    //     formDataToSend,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }
    //   );
    //   console.log(response.data);
    // } catch (error) {
    //   console.error('Error submitting form:', error);
    // }
  };
  return (
    <div className="sell_crs_content">
      {!courseCreated && (
        <form className="create_crs_form" onSubmit={handleSubmit}>
          {currentStep === 0 && (
            <div className="splitter br_btm">
              <div className="half">
                <div className="sc_form_group">
                  <label htmlFor="category">Choose a category</label>
                  <select
                    className="crs_cat"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
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
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
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
                <input
                  type="text"
                  name="subTitle"
                  id="subTitle"
                  value={formData.subTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="sc_form_group br_btm">
                <label htmlFor="description">
                  Describe your course in less than 50 words.
                </label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                />
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
              <label htmlFor="objectives">Write atleast 4 Objectives</label>
              <div className="sc_desc_inputs">
                {formData.objectives.map((objective, index) => (
                  <input
                    id="objectives"
                    type="text"
                    key={index}
                    value={objective}
                    maxLength={150}
                    onChange={(event) =>
                      handleObjectiveChange(index, event.target.value)
                    }
                  />
                ))}
              </div>
            </div>
          )}
          {currentStep === 3 && (
            <div className="sc_form_group br_btm">
              <label htmlFor="prerequisites">
                What are the requirements or prerequisites for taking your
                course?
              </label>
              <p>
                List the required skills, experience, tools or equipment
                learners should have prior to taking your course.
              </p>
              <p>
                If there are no requirements, use this space as an opportunity
                to lower the barrier for beginners.
              </p>
              <input
                type="text"
                name="prerequisites"
                id="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
              />
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <div className="sc_form_group">
                <label htmlFor="courseFor">Who is this course for?</label>
                <p>
                  Write a clear description of the intended learners for your
                  course who will find your course content valuable.
                </p>
                <small className="src_sml_txt">
                  This will help you attract the right learners to your course.
                </small>
                <input
                  type="text"
                  name="courseFor"
                  id="courseFor"
                  value={formData.courseFor}
                  onChange={handleChange}
                />
              </div>
              <div className="sc_form_group">
                <label htmlFor="level">Select Level</label>
                <select
                  className="crs_cat"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                >
                  <option value="beginner">Beginner Level</option>
                  <option value="intermidiate">Intermidiate Level</option>
                  <option value="expert">Expert Level</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              <div className="sc_form_group">
                <label htmlFor="sections">How many Sections are in your Course?</label>
                <input
                type="number"
                name="sections"
                id="sections"
                value={formData.sections}
                onChange={handleChange}
              />
              </div>
              <div className="sc_form_group br_btm">
                <label htmlFor="duration">How many hours is your course?</label>
                <input
                type="number"
                name="duration"
                id="duration"
                value={formData.duration}
                onChange={handleChange}
              />
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="sc_form_group br_btm">
              <label htmlFor="videoFile">
                <span className="upload_btn">Upload</span> Course Video
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/*"
                onChange={handleVideoChange}
              />
              {formData.videoFile ? (
                <p>Video selected: {formData.videoFile.name}</p>
              ) : (
                <p>No Video selected</p>
              )}
            </div>
          )}
          {currentStep === 6 && (
            <div className="sc_form_group br_btm">
              <label htmlFor="imageFile">
                <span className="upload_btn">Upload </span>Course Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imageFile ? (
                <p>Image selected: {formData.imageFile.name}</p>
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
                    <select
                      className="crs_cat"
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                    >
                      <option value="USD">USD</option>
                      <option value="ETB">ETB</option>
                    </select>
                  </div>
                </div>
                <div className="half">
                  <div className="sc_form_group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      name="price"
                      step={0.1}
                      id="price"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {currentStep === 8 && (
            <div className="sc_form_group br_btm center">
              <p>Make sure all fileds are filled Before creating course.</p>
              <button
                onClick={() => setCourseCreated(true)}
                className="sc_submit_btn"
                type="button"
              >
                Create New Course
              </button>
            </div>
          )}
          <div className="sc_navigation">
            {currentStep > 0 && (
              <button type="button" onClick={prevStep}>
                Previous
              </button>
            )}
            {currentStep < totalSteps - 1 && (
              <button type="button" onClick={nextStep}>
                Next
              </button>
            )}
          </div>
        </form>
      )}
      {courseCreated && (
        <div className="sc_form_group br_btm center">
          <b>Your course is submitted for Review.</b>
        </div>
      )}
    </div>
  );
};

export default SellCourse;
