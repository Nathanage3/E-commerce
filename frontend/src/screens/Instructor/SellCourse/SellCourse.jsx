import { useState } from 'react';
import { categoriesData } from '../../../fakeData';
import './SellCourse.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';

const SellCourse = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseCreated, setCourseCreated] = useState(false);
  const totalSteps = 9;
  const progressPercentage = (currentStep / (totalSteps - 1)) * 100;
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    subTitle: '',
    objectives: ['', '', '', ''],
    description: '',
    prerequisites: '',
    courseFor: '',
    level: '',
    videoFile: [],
    // videoUrls: [],
    imageFile: null,
    // imageUrl: null,
    price: '',
    currency: '',
    sections: '',
    duration: '',
  });
  console.log(currentStep);

  const placeholders = [
    'e.g. Define the roles and responsibilities of a Digital Marketer',
    'e.g. Develop a comprehensive digital marketing strategy',
    'e.g. Analyze and interpret key performance indicators (KPIs)',
    'e.g. Understand the fundamentals of SEO and its impact on visibility',
  ];
  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
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
    const files = Array.from(event.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prevState) => ({
      ...prevState,
      videoFile: files,
      videoUrls: urls,
    }));
  };
  const removeVideo = (index) => {
    setFormData((prevState) => {
      const updatedFiles = prevState.videoFile.filter((_, i) => i !== index);
      const updatedUrls = prevState.videoUrls.filter((_, i) => i !== index);

      return {
        ...prevState,
        videoFile: updatedFiles,
        videoUrls: updatedUrls,
      };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const url = file ? URL.createObjectURL(file) : null;

    setFormData((prevState) => ({
      ...prevState,
      imageFile: file,
      imageUrl: url,
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
  console.log(formData);

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
      <div className="inst_content_hdr">Create a new Courses.</div>
      <div className="sell_crs_progress_bar">
        <div
          className="progresser"
          style={{
            width: `${progressPercentage}%`,
          }}
        />
      </div>
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
                    <option value="">Choose a category</option>
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
                    placeholder="e.g. Learn Digital Marketing Basics"
                  />
                </div>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <>
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
                  placeholder="e.g. Fast & effective Landing Page course..."
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
                  placeholder="e.g. Learn how to Design, Build & Publish high-converting landing pages..."
                />
              </div>
            </>
          )}
          {currentStep === 2 && (
            <div className="sc_form_group br_btm">
              <div className="sc_label">
                What will students learn in your course?
              </div>
              <div className="sc_para">
                You must enter objectives or outcomes that learners can expect
                to achieve after completing your course.
              </div>

              <small className="src_sml_txt">
                These objectives will help learners decide if your course is
                right for them.
              </small>
              <fieldset className="sc_objs_input_fieldset">
                <legend className="sc_objs_input_legend">
                  Write atleast 4 Objectives
                </legend>
                <div className="sc_desc_inputs">
                  {formData.objectives.map((objective, index) => (
                    <input
                      id={`objective-${index}`}
                      type="text"
                      key={index}
                      value={objective}
                      maxLength={150}
                      placeholder={placeholders[index]}
                      onChange={(event) =>
                        handleObjectiveChange(index, event.target.value)
                      }
                    />
                  ))}
                </div>
              </fieldset>
            </div>
          )}
          {currentStep === 3 && (
            <div className="sc_form_group br_btm">
              <label htmlFor="prerequisites">
                What are the requirements or prerequisites for taking your
                course?
              </label>
              <p className="sc_para">
                List the required skills, experience, tools or equipment
                learners should have prior to taking your course. <br />
                If there are no requirements write &quot;none&quot;
              </p>
              <input
                type="text"
                name="prerequisites"
                id="prerequisites"
                placeholder="e.g You should have basic familiarity with social media"
                value={formData.prerequisites}
                onChange={handleChange}
              />
            </div>
          )}
          {currentStep === 4 && (
            <div>
              <div className="sc_form_group">
                <label htmlFor="courseFor">Who is this course for?</label>
                <p className="sc_para">
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
                  placeholder="e.g. Beginner Python developers curious abour data science"
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
                  <option>Select Level</option>
                  <option value="beginner">Beginner Level</option>
                  <option value="intermidiate">Intermidiate Level</option>
                  <option value="expert">Expert Level</option>
                  <option value="all">All Levels</option>
                </select>
              </div>
              <div className="sc_form_group">
                <label htmlFor="sections">
                  How many Sections are in your Course?
                </label>
                <input
                  type="number"
                  name="sections"
                  id="sections"
                  placeholder="Enter how many sections your course has"
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
                  placeholder="Enter the total duration of your course"
                  value={formData.duration}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="sc_form_group br_btm">
              <div className="upload_media_hdr">Upload Course Videos</div>
              <label className="upload_label" htmlFor="videoFile">
                <span className="upload_btn">Click to Choose Videos</span>
              </label>
              <input
                type="file"
                id="videoFile"
                name="videoFile"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
              />
              {formData.videoFile && formData.videoFile.length > 0 ? (
                <div className="selected_vids_div">
                  <div className="selected_vids_count">
                    {formData.videoFile.length} Videos selected
                  </div>
                  <div className="selected_vids_preview">
                    {formData.videoUrls.map((url, index) => (
                      <div className="vid_box" key={index}>
                        <video className="vid_box_vid" controls>
                          <source src={url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <p className="vid_name">
                          {formData.videoFile[index].name}
                        </p>
                        <button
                          type="button"
                          className="remove_selected_vid_btn center"
                          onClick={() => removeVideo(index)}
                        >
                          Remove
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No Videos selected</p>
              )}
            </div>
          )}
          {currentStep === 6 && (
            <div className="sc_form_group br_btm">
              <div className="upload_media_hdr">Upload Course Videos</div>
              <label className="upload_label" htmlFor="imageFile">
                <span className="upload_btn">Click to choose Image</span>
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.imageFile ? (
                <div className="selected_image_div">
                  <img src={formData.imageUrl} alt="Selected" />
                  <p className="vid_name">{formData.imageFile.name}</p>
                  <button
                    type="button"
                    className="remove_selected_vid_btn center"
                    onClick={() =>
                      setFormData((prevState) => ({
                        ...prevState,
                        imageFile: null,
                        imageUrl: null,
                      }))
                    }
                  >
                    Remove <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ) : (
                <p>No Image selected</p>
              )}
            </div>
          )}
          {currentStep === 7 && (
            <div className="sc_form_group br_btm">
              <p className="upload_media_hdr">Set a price for your course.</p>
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
                      <option>Select Currency</option>
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
                      placeholder="Enter price"
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
              <p className="sc_para">
                Make sure all fileds are filled Before creating course.
              </p>
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
              <button
                className="sell_crs_next_btn"
                type="button"
                onClick={nextStep}
              >
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
