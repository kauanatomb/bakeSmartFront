import express from 'express' 
import { getAllIngredients, createIngredient, updateIngredient, deleteOneIngredient, getOneIngredient } from "../controllers/ingredientController.js";
import auth from '../middleware/auth.js'

const router = express.Router()

router.get('/', getAllIngredients);

router.post('/', auth, createIngredient);

router.put('/:id', updateIngredient);

router.delete('/:id', deleteOneIngredient);

router.get('/:id', getOneIngredient);

export default router