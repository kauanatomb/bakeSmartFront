import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLoginUser = () => {
    const data = {
      email,
      name,
      password
    };
    setLoading(true);
    axios
      .post('http://localhost:5555/user/signup', data)
      .then((response) => {
        setLoading(false);
        const { token } = response.data;
        localStorage.setItem('token', token);
        enqueueSnackbar('Login realizado com sucesso', { variant: 'success' });
        navigate('/recipes');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Erro ao criar usuário. Verifique suas credenciais.', { variant: 'error' });
        console.error('Erro ao criar usuário:', error);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      {loading ? <Spinner /> : ''}
      <form onSubmit={(e) => { e.preventDefault(); handleLoginUser(); }} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label className="mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-1">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 transition duration-300 hover:bg-blue-600"
        >
          {loading ? 'Carregando...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default CreateUser