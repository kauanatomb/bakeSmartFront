import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const LogoutButton = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (token == 'undefined' || !token) {
      navigate('/login');
      enqueueSnackbar('Faça login para visualizar seus ingredientes', { variant: 'warning' });
    }
  }, [token, navigate, enqueueSnackbar]);

  const handleLogout = () => {
    axios.delete(`${import.meta.env.VITE_API_URL}/logout`, {
      headers: {
        Authorization: token
      }
    })
    .then(() => {
      localStorage.removeItem('token');
      navigate('/login');
    })
    .catch((error) => {
      console.log('Error logging out:', error);
    });
  };  

  return (
    <button className="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-gray-400 mr-4" onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;