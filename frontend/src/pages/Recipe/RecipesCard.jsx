import { Link } from 'react-router-dom';
import RecipeSingleCard from './RecipeSingleCard';
import PropTypes from 'prop-types';

const RecipesCard = ({ recipes }) => {
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {recipes.map((recipe, index) => (
        <RecipeSingleCard key={recipe.id} recipe={recipe} index={index} />
      ))}
    </div>
  );
};

RecipesCard.propTypes = {
  recipes: PropTypes.array.isRequired,
};

export default RecipesCard;