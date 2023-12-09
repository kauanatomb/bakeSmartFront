import express from 'express' 
import { getAllIngredients, createIngredient, updateIngredient } from "../controllers/ingredientController.js";

const router = express.Router()

router.get('/', getAllIngredients);

router.post('/', createIngredient);

router.put('/:id', updateIngredient);

export default router