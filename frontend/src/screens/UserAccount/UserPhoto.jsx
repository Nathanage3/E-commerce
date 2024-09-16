import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

const UserPhoto = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadImage, setUploadImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const handleImageChange = (e) => {
    console.log(e.target.files);
    setProfilePicture(e.target.files[0]);
    setPreviewImage(URL.createObjectURL(e.target.files[0]));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('profilePicture', profilePicture);
    //   const response = await axiosInstance.post(
    //     '/users/upload_image',
    //     formData,
    //     {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     }
    //   );
     
    } catch (error) {
      console.log(error);
     
    } 
  };
  return (
    <div className="flex gap profile_picture">
      <div className="image_wrapper">
        <img
          src={previewImage}
          alt="Profile picture"
        />
      </div>

      <form className="upload_image_form" onSubmit={handleSubmit}>
        <label
          htmlFor="uploadImage"
          className="select_image"
          onClick={() => setUploadImage(true)}
        >
          Change Image
        </label>
        <input id="uploadImage" type="file" onChange={handleImageChange} />

        {uploadImage && (
          <button
            className="upload_image_btn flex sm_gap"
            type="submit"
          >
            <FontAwesomeIcon icon={faUpload} />
          Upload
          </button>
        )}

      </form>
    </div>
  );
};

export default UserPhoto;
