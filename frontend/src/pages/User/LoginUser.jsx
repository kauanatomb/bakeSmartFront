import React, { useState, useEffect } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

const LoginUser = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLoginUser = () => {
    const user = {
      email,
      password
    };
    setLoading(true);
    axios
    .post(`${import.meta.env.VITE_API_URL}/login`, { user: user })
      .then((response) => {
        setLoading(false);
        const token = response.headers['authorization'].split(' ')[1];
        if (token) {
          localStorage.setItem('token', token);
        } else {
          enqueueSnackbar("Erro ao obter token", { variant: "error" });
        }
        enqueueSnackbar("Login realizado com sucesso", { variant: "success" });
        navigate("/recipes");
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.data && error.response.data.error) {
          enqueueSnackbar(error.response.data.error, { variant: 'error' });
        } else {
          enqueueSnackbar('Erro ao fazer login. Verifique suas credenciais.', { variant: 'error' });
        }
        console.error('Erro ao fazer login:', error);
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-3xl font-bold mb-4">Acesse sua conta</h2>
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
        <Link to="/signup" className="text-blue-500 hover:text-blue-600">
          Não tenho conta
        </Link>
      </form>
    </div>
  )
}

export default LoginUser