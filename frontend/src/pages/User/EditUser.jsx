import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  if (!token) {
    enqueueSnackbar('Faça login para editar seu usuário', { variant: 'warning' });
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setName(response.data.user.name);
        setEmail(response.data.user.email);
        setPassword(response.data.user.password);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }
  , [token, id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .put(`http://localhost:5555/user/${id}`, {
        name,
        email,
        password
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Usuário editado com sucesso', { variant: 'success' });
        navigate('/recipes');
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
        enqueueSnackbar('Erro ao editar usuário', { variant: 'error' });
      });
  }

  return (

    <div className='p-4'>
      <BackButton destination={"/ingredients"}/>
      <h1 className='text-3xl my-4'>Edite seu usuário</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4 '>
        <div className='my-4 space-y-4'>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Nome</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Email</label>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Senha</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            />
          </div>
        </div>
        <button className='p-2 bg-sky-300 my-4' onClick={handleSubmit}>
          Salvar
        </button>
      </div>
    </div>
  );  
}

export default EditUser