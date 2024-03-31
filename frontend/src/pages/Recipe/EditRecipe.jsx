import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditRecipe = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token == 'undefined' || !token) {
      navigate('/login');
      enqueueSnackbar('Faça login para editar suas receitas', { variant: 'warning' });
    }
  }, [token, navigate, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    axios.get(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
      headers: {
        Authorization: token
      }
    })
    .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
        setCookTime(response.data.cook_time);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [id, token])
  
  const handleEditRecipe = () => {
    const data = {
      name,
      description,
      cook_time: cookTime
    };

    setLoading(true);
    axios
      .put(`${import.meta.env.VITE_API_URL}/recipes/${id}`, data, {
        headers: {
          Authorization: token
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Receita editada com sucesso', { variant: 'success' });
        navigate(`/recipes`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para atualizar uma receita', { variant: 'warning' });
        } else {
          setLoading(false);
          enqueueSnackbar('Erro ao atualizar receita', { variant: 'error' });
        }
      });
  };

  return (
    <div className='p-4'>
      <BackButton destination={"/recipes"}/>
      <h1 className='text-3xl my-4'>Editar Receita</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-500'>Nome</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-500'>Descrição</label>
          <input
            type='text'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-500'>Tempo de preparo</label>
          <input
            type='text'
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='my-4 p-2 bg-sky-300 ' onClick={handleEditRecipe}>
          Salvar
        </button>
      </div>
    </div>
  )
}

export default EditRecipe