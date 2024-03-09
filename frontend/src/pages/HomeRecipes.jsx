import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import RecipesCard from './Recipe/RecipesCard.jsx';
import Menu from '../components/Menu.jsx'

const HomeRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token == 'undefined' || !token) {
      navigate('/login');
      enqueueSnackbar('Faça login para vesualizar suas receitas', { variant: 'warning' });
    }
  }, [token, navigate, enqueueSnackbar]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/recipes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setRecipes(response.data.data);
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
          <h1 className='text-3xl my-8'>Sua Lista de Receitas</h1>
          <Link to='/recipes/create'>
            <MdOutlineAddBox className='text-sky-800 text-4xl' />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : recipes.length === 0 ? (
          <div className='text-center'>
            <p>Você ainda não tem nenhuma receita!</p>
            <p>Crie uma nova receita agora mesmo clicando no botão acima!</p>
          </div>
        ) : (
          <RecipesCard recipes={recipes} />
        )}
      </div>
    </>
  );
  
}  

export default HomeRecipes;