import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateRecipes = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredientsList, setIngredientsList] = useState([]);
  const [quantity, setQuantity] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/ingredients`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setIngredients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/measurement_units`)
      .then((response) => {
        setMeasurementUnits(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleAddIngredient = () => {
    const newIngredient = {
      ingredient_id: selectedIngredient,
      measurement_unit_id: selectedMeasurementUnit,
      quantity,
    };
    setIngredientsList([...ingredientsList, newIngredient]);
    setSelectedIngredient('');
    setSelectedMeasurementUnit('');
    setQuantity('');
  };

  const handleCreateRecipe = () => {
    const data = {
      recipe: {
      name,
      description,
      cook_time: cookTime,
      recipe_ingredients_attributes: ingredientsList
      }
    };
  
    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/recipes`, data, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setLoading(false);
        const { id } = response.data;
        enqueueSnackbar('Receita criada com sucesso', { variant: 'success' });
        navigate(`/recipes/details/${id}`);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para criar uma receita', { variant: 'warning' });
        } else {
          setLoading(false);
          enqueueSnackbar('Erro ao criar receita', { variant: 'error' });
        }
      });
  }

  return (
    <div>
      <div className='p-4'>
        <BackButton destination={"/recipes"}/>
        <h1 className='text-3xl my-4'>Criar uma receita</h1>
        {loading ? <Spinner /> : ''}
        <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
          <div className='my-4'>
            <label className='text-xl mr-4 text-gray-500'>Nome</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
            <label className='text-xl mr-4 text-gray-500'>Descrição</label>
            <input
              type='text'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
            <label className='text-xl mr-4 text-gray-500'>Tempo de preparo</label>
            <input
              type='text'
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
        </div>
      </div>
      <div className='p-4'>
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
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} - {ingredient.measurement_unit.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className='text-xl mr-4 text-gray-500'>Unidade de Medida</label>
              <select
                value={selectedMeasurementUnit}
                onChange={(e) => setSelectedMeasurementUnit(e.target.value)}
                className='form-select border border-gray-500 px-4 py-2 w-full'
              >
                <option value=''>Selecione uma unidade de medida</option>
                {measurementUnits.map((uom) => (
                  <option key={uom.id} value={uom.id}>
                    {uom.name}
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
          <button className='p-2 bg-sky-300 mt-2' onClick={handleCreateRecipe}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateRecipes