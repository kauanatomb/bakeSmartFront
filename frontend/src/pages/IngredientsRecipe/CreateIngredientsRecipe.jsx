import React, { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateIngredientsRecipe = () => {
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState('');
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const token = localStorage.getItem('token');

  if (!token) {
    enqueueSnackbar('Faça login para criar um ingrediente', { variant: 'warning' });
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/ingredients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setIngredients(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/unitOfMeasures')
      .then((response) => {
        setUnitOfMeasures(response.data.unitOfMeasures);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleAddIngredient = () => {
    const newIngredient = {
      ingredientId: selectedIngredient,
      unitOfMeasureId: selectedUnitOfMeasure,
      quantity,
    };
    setIngredientsList([...ingredientsList, newIngredient]);
    setSelectedIngredient('');
    setSelectedUnitOfMeasure('');
    setQuantity('');
  };

  const handleSaveIngredientsRecipe = () => {
    const data = {
      ingredients: ingredientsList,
    };

    setLoading(true);
    axios
      .post(`http://localhost:5555/recipes/${id}/ingredients`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingredientes criados com sucesso', { variant: 'success' });
        navigate(`/recipes/details/${id}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton destination={`/recipes/details/${id}`} />
      <h1 className='text-3xl my-4'>Adicionar Ingrediente à Receita</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
        <div className='my-4 space-y-4'>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Ingrediente</label>
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione um ingrediente</option>
              {ingredients.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name} - {ingredient.unitOfMeasure.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Unidade de Medida</label>
            <select
              value={selectedUnitOfMeasure}
              onChange={(e) => setSelectedUnitOfMeasure(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione uma unidade de medida</option>
              {unitOfMeasures.map((uom) => (
                <option key={uom._id} value={uom._id}>
                  {uom.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Quantidade</label>
            <input
              type='text'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
        </div>
        <button className='p-2 bg-sky-300 my-4' onClick={handleAddIngredient}>
          Adicionar Ingrediente
        </button>
        <button className='p-2 bg-sky-300 my-4' onClick={handleSaveIngredientsRecipe}>
          Salvar Ingredientes
        </button>
      </div>
    </div>
  );
};

export default CreateIngredientsRecipe;
