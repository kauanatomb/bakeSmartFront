import React, { useState, useEffect } from 'react';
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

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token === 'undefined' || !token) {
      navigate('/login');
      enqueueSnackbar('Faça login para deletar suas receitas', { variant: 'warning' });
    }
  }, [token, enqueueSnackbar, navigate]);

  const handleDeleteRecipe = () => {
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Receita deletada com sucesso', { variant: 'success' });
        navigate('/recipes');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para excluir uma receita', { variant: 'warning' });
        } else {
          setLoading(false);
          enqueueSnackbar('Erro ao excluir a receita', { variant: 'error' });
        }
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
  );
};

export default DeleteRecipe;