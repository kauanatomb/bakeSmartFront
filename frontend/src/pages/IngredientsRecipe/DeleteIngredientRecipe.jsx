import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteIngredientRecipe = () => {
  const [loading, setLoading] = useState(false);
  const [ingredientName, setIngredientName] = useState('');
  const navigate = useNavigate();
  const { recipeId, id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/recipe_ingredients/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setIngredientName(response.data.ingredient.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, token]);

  const handleDeleteIngredientRecipe = () => {
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/recipe_ingredients/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar(`Ingrediente ${ingredientName} deletado com sucesso`, { variant: 'success' });
        navigate(`/recipes/details/${recipeId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Erro ao deletar o ingrediente', { variant: 'error' });
        console.log(error);
      });
  };
  
  return (
    <div className='p-4'>
      <BackButton destination={"/recipes"}/>
      <h1 className='text-3xl my-4'>Apagar Ingrediente da Receita</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl p-8'>
        <h3 className='text-2xl'>Você tem certeza que deseja apagar o ingrediente {ingredientName}?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteIngredientRecipe}
        >
          Sim, quero apagar
        </button>
      </div>
    </div>
  )
}

export default DeleteIngredientRecipe;
