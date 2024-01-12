import React, { useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteRecipe = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteRecipe = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      enqueueSnackbar('Faça login para deletar uma receita', { variant: 'warning' });
      navigate('/login');
    }
    setLoading(true);
    axios
      .delete(`http://localhost:5555/recipes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Receita deletada com sucesso', { variant: 'success' });
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
      <h1 className='text-3xl my-4'>Apagar Receita</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl p-8 '>
        <h3 className='text-2xl'>Você tem certeza que deseja apagar essa receita?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteRecipe}
        >
          Sim, quero apagar
        </button>
      </div>
    </div>
  )
}

export default DeleteRecipe;