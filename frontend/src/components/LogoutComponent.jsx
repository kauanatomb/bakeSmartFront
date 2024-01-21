import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
  }

  const handleLogout = () => {
    axios.post('http://localhost:5555/user/logout', null, {
      headers: {
        Authorization: `Bearer ${token}`
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