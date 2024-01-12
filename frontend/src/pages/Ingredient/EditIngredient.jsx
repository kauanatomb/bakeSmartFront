import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditIngredient = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedUnitOfMeasure, setSelectedUnitOfMeasure] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  if (!token) {
    enqueueSnackbar('Faça login para editar um ingrediente', { variant: 'warning' });
    navigate('/login');
  }

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5555/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        setCategories(response.data.categories);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
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
    axios.get(`http://localhost:5555/ingredients/${id}`)
    .then((response) => {
        setName(response.data.name);
        setQuantity(response.data.quantity);
        setBrand(response.data.brand);
        setSelectedCategory(response.data.category.name);
        setSelectedUnitOfMeasure(response.data.unitOfMeasure.unit);
        setPrice(response.data.price);
        setLoading(false);
      }).catch((error) => {
        setLoading(false);
        alert('An error happened. Please Check console');
        console.log(error);
      });
  }, [id])
  
  const handleEditIngredient = () => {
    const data = {
      name,
      quantity,
      brand,
      category: selectedCategory,
      unitOfMeasure: selectedUnitOfMeasure,
      price
    };

    setLoading(true);
    axios
      .put(`http://localhost:5555/ingredients/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingredient Edited successfully', { variant: 'success' });
        navigate('/ingredients');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton destination={"/ingredients"}/>
      <h1 className='text-3xl my-4'>Editar um Ingrediente</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4 '>
        <div className='my-4 space-y-4'>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Nome</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Marca</label>
            <input
              type='text'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione uma categoria</option>
              {categories.map((category, index) => (
                <option key={index} value={category.name}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Unidade de medida</label>
            <select
              value={selectedUnitOfMeasure}
              onChange={(e) => setSelectedUnitOfMeasure(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione uma unidade de medida</option>
              {unitOfMeasures.map((uom, index) => (
                <option key={index} value={uom.unit}>
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
          <div>
            <label className='text-xl mr-4 text-gray-500'>Preço (somente número) </label>
            <input
              type='text'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full'
            />
          </div>
        </div>
        <button className='p-2 bg-sky-300 my-4' onClick={handleEditIngredient}>
          Salvar
        </button>
      </div>
    </div>
  );  
}

export default EditIngredient