import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Menu from '../components/Menu.jsx'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { useSnackbar } from 'notistack';
import IngredientsTable from './Ingredient/IngredientsTable.jsx';

const HomeIngredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  if (!token) {
    enqueueSnackbar('Faça login para deletar uma receita', { variant: 'warning' });
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/ingredients', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setIngredients(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

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