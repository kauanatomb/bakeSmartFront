import express from 'express' 
import { addIngredientsToRecipe, getAllIngredientsRecipe } from '../controllers/ingredientRecipeController.js'

const router = express.Router()

router.post('/recipes/:recipeId/ingredients', addIngredientsToRecipe);
router.get('/recipes/:recipeId/ingredients', getAllIngredientsRecipe);

export default router