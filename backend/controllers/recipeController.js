import { Recipe } from '../models/recipeModel.js'
import { IngredientRecipe } from '../models/ingredientRecipeModel.js'

const createRecipe = async (request, response) => {
  try {

    const { name, description, cookTime } = request.body;
    const newRecipe = { name, description, cookTime };

    const recipe = await Recipe.create(newRecipe);

    return response.status(201).send(recipe);
  } catch (error) {
    console.log(error.message);
    return response.status(500).send({ message: 'Internal Server Error' });
  }
};

const getAllRecipes = async (request, response) => {
  try {
    const recipes = await Recipe.find();
    const recipesWithIngredients = [];

    for (const recipe of recipes) {
      const ingredientsRecipe = await IngredientRecipe.find({ recipe: recipe._id })
        .populate('ingredient', 'name')
        .populate('unitOfMeasure', 'unit');

      recipesWithIngredients.push({
        recipe,
        ingredients: ingredientsRecipe
      });
    }

    response.json({ data: recipesWithIngredients });
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
  }
};


const getOneRecipe = async (request,response) => {
  try {
    const { id } = request.params;
    const recipe = await Recipe.findById(id)
    const ingredientsRecipe = await IngredientRecipe.find({ recipe: id })
    .populate('ingredient')
    .populate('unitOfMeasure')

    return response.status(200).json({ 
      data: {
        recipe,
        ingredients: ingredientsRecipe
      }
    })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
}

const updateOneRecipe = async (request, response) => {
  try {

    const { id } = request.params
    const result = await Recipe.findByIdAndUpdate(id, request.body)
    if (!result) {
      return response.status(404).json({ message: 'Recipe not found' })
    }
    response.json(result);
    return response.status(200).send({ message: 'Recipe updated successfully' })

  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
}

const deleteOneRecipe = async (request, response) => {
  try {
    const { id } = request.params
    const result = await Recipe.findByIdAndDelete(id)

    if (!result) {
      return response.status(404).json( {message: 'Recipe not found' })
    }

    return response.status(200).send({ message: 'Recipe deleted successfully' })
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message })
  }
}

export { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe };

