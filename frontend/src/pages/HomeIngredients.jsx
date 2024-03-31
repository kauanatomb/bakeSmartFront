import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Menu from '../components/Menu.jsx'
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { useSnackbar } from 'notistack';
import IngredientsTable from './Ingredient/IngredientsTable.jsx';

const HomeIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token == 'undefined' || !token) {
      navigate('/login');
      enqueueSnackbar('Faça login para visualizar seus ingredientes', { variant: 'warning' });
    }
  }, [token, navigate, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/ingredients`, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setIngredients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response || error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para ver seus ingredientes', { variant: 'warning' });
        } else {
          console.log(error);
          setLoading(false);
        }
      });
  }, [token, enqueueSnackbar, navigate]);

  return (
    <>
      <Menu />
      <div className='p-4'>
        <div className='flex justify-between items-center'>
          <h1 className='text-3xl my-8'>Sua Lista de Ingredientes</h1>
          <Link to='/ingredients/create'>
            <MdOutlineAddBox className='text-sky-800 text-4xl' />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : ingredients.length === 0 ? (
          <div className='text-center'>
            <p>Você ainda não tem nenhum ingrediente!</p>
            <p>Crie um novo ingrediente agora mesmo clicando no botão acima!</p>
          </div>
        ) : (
          <IngredientsTable ingredients={ingredients} />
        )}
      </div>
    </>
  );  
};

export default HomeIngredients;