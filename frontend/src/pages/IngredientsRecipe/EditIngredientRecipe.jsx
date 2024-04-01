import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditIngredientRecipe = () => {

  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedMeasurementUnit, setSelectedMeasurementUnit] = useState('');
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { recipeId, id } = useParams();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token == "undefined" || !token) {
      navigate("/login");
      enqueueSnackbar("Faça login para editar seus ingredientes", {
        variant: "warning",
      });
    }
  }, [token, navigate, enqueueSnackbar]);

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
        console.log(response.data);
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
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/recipe_ingredients/${id}`, {
        headers: {
          Authorization: token
        }
      })
      .then((response) => {
        setSelectedIngredient(response.data.ingredient_id);
        setSelectedMeasurementUnit(response.data.measurement_unit_id);
        setQuantity(response.data.quantity);
        console.log(response.data);
        setLoading(false);
      }
      )
      .catch((error) => {
        console.log(error);
        setLoading(false);
      }
      );
  }, [id, token]);

  const handleEditIngredientsRecipe = () => {
    const data = {
      ingredient_id: selectedIngredient,
      measurement_unit_id: selectedMeasurementUnit,
      quantity
    }

    setLoading(true);
    axios
      .put(`${import.meta.env.VITE_API_URL}/recipe_ingredients/${id}`, data , {
        headers: {
          Authorization: token
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingredientes atualizados com sucesso', { variant: 'success' });
        navigate(`/recipes/details/${recipeId}`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };
  return (
    <div className='container'>
      <BackButton />
      <h1>Editar Ingredientes da Receita</h1>
      <form onSubmit={handleEditIngredientsRecipe}>
        <div className='form-group'>
          <label htmlFor='ingredient'>Ingrediente</label>
          <select
            className='form-control'
            id='ingredient'
            value={selectedIngredient}
            onChange={(event) => setSelectedIngredient(event.target.value)}
          >
            <option value=''>Selecione um ingrediente</option>
            {ingredients.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='measurementUnit'>Unidade de Medida</label>
          <select
            className='form-control'
            id='measurementUnit'
            value={selectedMeasurementUnit}
            onChange={(event) => setSelectedMeasurementUnit(event.target.value)}
          >
            <option value=''>Selecione uma unidade de medida</option>
            {measurementUnits.map((measurementUnit) => (
              <option key={measurementUnit.id} value={measurementUnit.id}>
                {measurementUnit.name}
              </option>
            ))}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='quantity'>Quantidade</label>
          <input
            type='text'
            className='form-control'
            id='quantity'
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>
        <button type='submit' className='btn btn-primary' disabled={loading}>
          {loading && <Spinner />}
          Salvar
        </button>
      </form>
    </div>
  )
}

export default EditIngredientRecipe