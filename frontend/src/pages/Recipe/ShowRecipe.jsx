import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../../components/BackButton'
import Spinner from '../../components/Spinner'
import { Link } from 'react-router-dom';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';

const ShowRecipe = () => {
  const [recipe, setRecipe] = useState({})
  const [loading, setLoading] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/recipes/${id}`)
      .then((response) => {
        setRecipe(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className='p-4'>
      <div className='flex justify-between'>
        <div>
          <BackButton destination={`/recipes`}/>
          <h1 className='text-3xl my-4'>Veja sua receita</h1>
        </div>
        <div className='flex items-center justify-center'>
          <Link to={`/recipes/${id}/ingredients`} className='flex items-center'>
            <MdOutlineAddBox className='text-sky-800 text-4xl mr-2' />
            <h1>Adicione ingredientes</h1>
          </Link>
        </div>

      </div>
      {loading ? (
        <Spinner />
      ) : (
        
        <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Nome:</span>
            <span className='ml-2'>{recipe?.name}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Tempo de preparo:</span>
            <span className='ml-2'>{recipe?.cookTime}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Descrição:</span>
            <span className='ml-2'>{recipe?.description}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Ingredientes:</span>
            {recipe?.ingredients && recipe.ingredients.length > 0 ? (
              <div className='ml-2'>
                <table className='border-collapse border border-gray-500'>
                  <thead>
                    <tr className='bg-gray-200'>
                      <th className='border border-gray-500 p-2'>Nome</th>
                      <th className='border border-gray-500 p-2'>Quantidade</th>
                      <th className='border border-gray-500 p-2'>Unidade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe?.ingredients?.map((ingredient, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                        <td className='border border-gray-500 p-2'>{ingredient.name}</td>
                        <td className='border border-gray-500 p-2'>{ingredient.quantity}</td>
                        <td className='border border-gray-500 p-2'>{ingredient.unitOfMeasure.unit}</td>
                        <Link to={`/recipes/${recipe.id}/ingredients/edit/${ingredient._id}`}>
                          <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-yellow-400' />
                        </Link>
                        <Link to={`/recipes/${recipe._id}/ingredients/delete/${ingredient._id}`}>
                          <MdOutlineDelete className='text-2xl text-red-600 hover:text-red-400' />
                        </Link>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> ) : (
              <span> Essa receita não possui ingredientes </span>
            )}
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Valor receita:</span>
            {recipe?.ingredients && recipe.ingredients.length > 0 ? (
              <span className='ml-2'>{recipe?.costRecipe} Reais</span>
            ) : (
              <span> Essa receita não possui ingredientes </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowRecipe