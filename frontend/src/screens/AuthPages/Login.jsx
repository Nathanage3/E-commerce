import { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import Layout from '../../components/Layout';
import './Auth.css';
const Login = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const { email, password } = loginForm;
  const { login, error, isLoading } = useLogin();
  //   console.log(loginForm);
  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    await login(email, password);
  };

  return (
    <Layout>
      <section className="login_page">
        <div className="login_content">
          <h2 className="form_header">Log in to your account</h2>
          <form className="login_form" onSubmit={handleSubmit}>
            {isLoading && <div>LOADING...</div>}
            <div className="form_group">
              <label htmlFor="email">Email</label>
              <input
                className="input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                autoComplete="false"
                placeholder="xyz@email.com"
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
                onChange={handleChange}
                required
                autoComplete="false"
                placeholder="**********"
              />
            </div>

            <button disabled={isLoading} type="submit" className="submit_btn">
              Sign In
            </button>
            {error && <div>error:{error}</div>}
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
