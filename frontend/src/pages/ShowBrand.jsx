import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'

const ShowBrand = () => {
  const [brand, setBrand] = useState({})
  const [loading, setLoading] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5555/brands/${id}`)
      .then((response) => {
        setBrand(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Brand</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl p-4'>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Id:</span>
            <span className='ml-2'>{brand?._id}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Name:</span>
            <span className='ml-2'>{brand?.name}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Create Time:</span>
            <span className='ml-2'>{new Date(brand?.createdAt).toLocaleString()}</span>
          </div>
          <div className='my-2'>
            <span className='text-xl font-semibold text-gray-600'>Last Update Time:</span>
            <span className='ml-2'>{new Date(brand?.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBrand