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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5555/recipes/${id}`)
    .then((response) => {
        setName(response.data.data.name);
        setDescription(response.data.data.description);
        setCookTime(response.data.data.cookTime);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [id])
  
  const handleEditRecipe = () => {
    const data = {
      name,
      description,
      cookTime
    };

    setLoading(true);
    axios
      .put(`http://localhost:5555/recipes/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Recipe Edited successfully', { variant: 'success' });
        navigate('/recipes');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
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