import { useState } from 'react';
import { useSignup } from '../../hooks/useSignup';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { firstName, lastName, email, password, confirmPassword } = formData;
  const { signup, error, isLoading } = useSignup();

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
    if (
      firstName.trim() === '' ||
      lastName.trim() === '' ||
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    await signup(email, password, firstName, lastName);
  };
  
  return (
      <section className="register_page">
        <div className="register_content">
          <h2 className="form_header">Sign Up</h2>
          <form className="register_form" onSubmit={handleSubmit}>
            {isLoading && <div>LOADING...</div>}
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

            <div className="form_group">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
                placeholder="Enter Your Email"
                autoComplete="false"
              />
            </div>
            <div className="form_group">
              <label htmlFor="password">Password</label>
              <input
                className="input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                placeholder="Enter A Strong Password"
                autoComplete="false"
              />
            </div>
            <div className="form_group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="Confirm Your Password"
                onChange={handleInputChange}
                autoComplete="false"
              />
            </div>

            <button disabled={isLoading} type="submit" className="submit_btn">
              Register
            </button>
            {error && <div>error:{error}</div>}
          </form>
        </div>
      </section>
  );
};

export default Signup;
