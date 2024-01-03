import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const IngredientsTable = ({ ingredients }) => {
  return (
    <div className='overflow-x-auto'>
  <table className='w-full table-auto'>
    <thead>
      <tr className='bg-gray-200'>
        <th className='px-4 py-2'>Nome</th>
        <th className='px-4 py-2'>Marca</th>
        <th className='px-4 py-2'>Quantidade</th>
        <th className='px-4 py-2'>Preço (R$)</th>
        <th className='px-4 py-2 hidden md:table-cell'>Operações</th>
      </tr>
    </thead>
    <tbody>
      {ingredients.map((ingredient) => (
        <tr key={ingredient._id} className='bg-white'>
          <td className='px-3'>{ingredient?.name}</td>
          <td className='px-3'>{ingredient?.brand}</td>
          <td className='px-3'>{ingredient?.quantity} ({ingredient?.unitOfMeasure?.abbreviation})</td>
          <td className='px-3'>{ingredient?.price}</td>
          <td className='px-3'>
            <div className='flex items-center justify-center gap-x-4'>
              <Link to={`/ingredients/edit/${ingredient._id}`}>
                <AiOutlineEdit className='text-2xl text-yellow-600 hover:text-yellow-400' />
              </Link>
              <Link to={`/ingredients/delete/${ingredient._id}`}>
                <MdOutlineDelete className='text-2xl text-red-600 hover:text-red-400' />
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );  
};

export default IngredientsTable;