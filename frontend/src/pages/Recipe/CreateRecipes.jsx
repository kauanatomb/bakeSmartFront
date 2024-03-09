import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateRecipes = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  const handleCreateRecipe = () => {
    const data = {
      name,
      description,
      cookTime
    };
  
    useEffect(() => {
      if (token == 'undefined' || !token) {
        navigate('/login');
        enqueueSnackbar('Faça login para criar suas receitas', { variant: 'warning' });
      }
    }, [token])};
  
    useEffect(() => {
      setLoading(true);
      axios
        .post(`${import.meta.env.VITE_API_URL}/recipes`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          setLoading(false);
          const { _id } = response.data;
          enqueueSnackbar('Receita criada com sucesso', { variant: 'success' });
          navigate(`/recipes/${_id}/ingredients`);
        })
        .catch((error) => {
          setLoading(false);
          enqueueSnackbar('Erro ao criar receita', { variant: 'error' });
          console.error('Erro ao criar receita:', error);
        });
    }, [data, token])

  return ( 
    <div className='p-4'>
      <BackButton destination={"/recipes"}/>
      <h1 className='text-3xl my-4'>Criar uma receita</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Nome</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Descrição</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          <label className='text-xl mr-4 text-gray-500'>Tempo de preparo</label>
          <input
            type='text'
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 mt-2' onClick={handleCreateRecipe}>
          Salvar
        </button>
      </div>
    </div>
  );
}

export default CreateRecipes