import React, { useState, useEffect } from 'react';
import BackButton from '../../components/BackButton';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteIngredient = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token == "undefined" || !token) {
      navigate("/login");
      enqueueSnackbar("Faça login para deletar um ingrediente", {
        variant: "warning",
      });
    }
  }, [token]);

  const handleDeleteIngredient = () => {
    setLoading(true);
    axios
      .delete(`${import.meta.env.VITE_API_URL}/ingredients/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Ingrediente deletado com sucesso', { variant: 'success' });
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
      <h1 className='text-3xl my-4'>Apagar Ingrediente</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl p-8'>
        <h3 className='text-2xl'>Você tem certeza que deseja apagar esse Ingrediente?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteIngredient}
        >
          Sim, quero apagar
        </button>
      </div>
    </div>
  )
}

export default DeleteIngredient;