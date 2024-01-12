import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ onLogout }) => {

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/login');
  }

  const handleLogout = () => {
    axios.get('http://localhost:5555/user/logout', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      localStorage.removeItem('token');
      navigate('/login');
      onLogout();
    })
    .catch((error) => {
      console.log('Error logging out:', error);
    });
    onLogout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;