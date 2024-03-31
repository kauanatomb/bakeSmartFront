import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateIngredients = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [measurementUnits, setMeasurementUnits] = useState([]);
  const [price, setPrice] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token == "undefined" || !token) {
      navigate("/login");
      enqueueSnackbar("Faça login para criar um ingrediente", {
        variant: "warning",
      });
    }
  }, [token, enqueueSnackbar, navigate]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => {
        setCategories(response.data);
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

  const handleSaveIngredient = () => {
    const data = {
      name,
      quantity,
      brand,
      category_id: selectedCategory,
      measurement_unit_id: selectedUnit,
      price
    };

    setLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/ingredients`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingrediente criado com sucesso', { variant: 'success' });
        navigate('/ingredients');
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          navigate('/login');
          enqueueSnackbar('Faça login para criar um ingrediente', { variant: 'warning' });
        } else {
          setLoading(false);
          enqueueSnackbar('Erro ao criar ingrediente', { variant: 'error' });
        }
      });
  }
  return (
    <div className='p-4'>
      <BackButton destination={"/ingredients"}/>
      <h1 className='text-3xl my-4'>Criar um Ingrediente</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
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
            <label className='text-xl mr-4 text-gray-500'>Escolha uma categoria</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione uma categoria</option>
              {categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category?.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='text-xl mr-4 text-gray-500'>Escolha uma unidade de medida</label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className='form-select border border-gray-500 px-4 py-2 w-full'
            >
              <option value=''>Selecione uma unidade de medida</option>
              {measurementUnits.map((uom, index) => (
                <option key={index} value={uom.id}>
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
        <button className='p-2 bg-sky-300 my-4' onClick={handleSaveIngredient}>
          Salvar
        </button>
      </div>
    </div>
  );  
}

export default CreateIngredients