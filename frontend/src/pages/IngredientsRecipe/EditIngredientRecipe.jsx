import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditIngredientRecipe = () => {

  const [selectedIngredient, setSelectedIngredient] = useState('');
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
  }, [token]);

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

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/recipes/${id}/ingredients`)
      .then((response) => {
        setSelectedIngredient(response.data.data.ingredientId);
        setSelectedUnitOfMeasure(response.data.data.unitOfMeasureId);
        setQuantity(response.data.data.quantity);
        setLoading(false);
      }
      )
      .catch((error) => {
        console.log(error);
        setLoading(false);
      }
      );
  }, [id]);

  const handleEditIngredientsRecipe = () => {
    const data = {
      ingredientId: selectedIngredient,
      unitOfMeasureId: selectedUnitOfMeasure,
      quantity
    }

    setLoading(true);
    axios
      .put(`http://localhost:5555/recipes/${id}/ingredients`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingredientes atualizados com sucesso', { variant: 'success' });
        navigate(`/recipes/details/${id}`);
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
          <label htmlFor='unitOfMeasure'>Unidade de Medida</label>
          <select
            className='form-control'
            id='unitOfMeasure'
            value={selectedUnitOfMeasure}
            onChange={(event) => setSelectedUnitOfMeasure(event.target.value)}
          >
            <option value=''>Selecione uma unidade de medida</option>
            {unitOfMeasures.map((unitOfMeasure) => (
              <option key={unitOfMeasure.id} value={unitOfMeasure.id}>
                {unitOfMeasure.unit}
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