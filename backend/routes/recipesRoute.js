import express from 'express' 
import { createRecipe, getAllRecipes, getOneRecipe, updateOneRecipe, deleteOneRecipe } from '../controllers/recipeController.js';
import auth from '../middleware/auth.js'


const router = express.Router()

router.post('/', auth, createRecipe);

router.get('/', getAllRecipes)

router.get(`/:id`, getOneRecipe)

router.put('/:id', updateOneRecipe)

router.delete('/:id', deleteOneRecipe)

export default router