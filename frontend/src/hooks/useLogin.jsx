import {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useLogin = () => {
  const { connect } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/users/login', {
        email,
        password,
      });
      console.log(response);
      if (response.data) {
        connect(response.data.user);
        navigate('/', { replace: true });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(
        error.response.data.message || 'Error Loggin in, Please try again'
      );
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
