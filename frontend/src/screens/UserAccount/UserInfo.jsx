import { useState } from 'react';

const UserInfo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const { firstName, lastName } = formData;

  //   console.log(formData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName.trim() === '' || lastName.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
  };

  return (
    <div>
      <section className="register_page">
        <div className="register_content">
          <form className="register_form" onSubmit={handleSubmit}>
            <div className="flex spce_bwn">
              <div className="form_group half">
                <label htmlFor="firstName">First Name</label>
                <input
                  className="input"
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={handleInputChange}
                  autoComplete="false"
                />
              </div>
              <div className="form_group half">
                <label htmlFor="lastName">Last Name</label>
                <input
                  className="input"
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={handleInputChange}
                  autoComplete="false"
                />
              </div>
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default UserInfo;
