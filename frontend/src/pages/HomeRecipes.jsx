import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import RecipesCard from './Recipe/RecipesCard.jsx';
import Menu from '../components/Menu.jsx'

const HomeRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/recipes')
      .then((response) => {
        setRecipes(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

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