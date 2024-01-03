import { AiOutlineClose } from 'react-icons/ai';
import { PiBookOpenTextLight, PiCake } from 'react-icons/pi';
import { IoTimeOutline } from 'react-icons/io5';

const RecipeModal = ({ recipe, onClose, index }) => {
  return (
    <div
      className='fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center'
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className='w-[600px] max-w-full h-[400px] bg-white rounded-xl p-4 flex flex-col relative'
      >
        <AiOutlineClose
          className='absolute right-6 top-6 text-3xl text-red-600 cursor-pointer'
          onClick={onClose}
        />
        <h2 className='w-fit px-4 py-1 bg-red-300 rounded-lg'>
          {recipe.createdAt}
        </h2>
        <h4 className='my-2 text-gray-500'>{index + 1}</h4>
        <div className='flex justify-start items-center gap-x-2'>
          <PiCake className='text-red-300 text-2xl' />
          <h2 className='my-1'>{recipe.name}</h2>
        </div>
        <div className='flex justify-start items-center gap-x-2'>
        <IoTimeOutline className='text-red-300 text-2xl' />
          <h2 className='my-1'>{recipe.cookTime}</h2>
        </div>
        <p className='flex justify-start items-center gap-x-2'>
        <PiBookOpenTextLight className='text-red-300 text-2xl'/>
          <h2 className='my-1'>{recipe.description}</h2>
        </p>
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>Ingredientes:</h3>
          {recipe?.ingredients && recipe.ingredients.length > 0 ? (
          <ul>
          {recipe?.ingredients?.map((ingredient, index) => (
            <li key={index} className='mb-2'>
              {ingredient.name} - {ingredient.quantity} ({ingredient.unitOfMeasure.unit})
            </li>
          ))}
        </ul>) : (
          <span> Essa receita não possui ingredientes </span>
        )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;