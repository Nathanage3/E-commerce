import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import axiosInstance from '../utils/axiosInstance';

export const useSignup = () => {
  const { connect } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const signup = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/users/register', {
        formData,
      });
      console.log(response);

      if (response.data.success) {
        connect(response.data.user);
        navigate('/', { replace: true });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
