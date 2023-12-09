import { Recipe } from '../models/recipeModel.js';
import { IngredientRecipe } from '../models/ingredientRecipeModel.js';
import { UnitOfMeasure } from '../models/unitOfMeasureModel.js';
import { Ingredient } from '../models/ingredientModel.js';

const getAllIngredientsRecipe = async (req, res) => {
  const { recipeId } = req.params;
  try {
    const ingredientsRecipe = await IngredientRecipe.find({recipe: recipeId})
      .populate('ingredient')
      .populate('unitOfMeasure')

    const costRecipe = await calculateCost(ingredientsRecipe)

    res.json({
      count: ingredientsRecipe.length, 
      data: ingredientsRecipe,
      price: costRecipe
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addIngredientsToRecipe = async (req, res) => {
  const { recipeId } = req.params;
  const { ingredients } = req.body;

  try {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Receita não encontrada' });
    }

    if (!Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'O campo de ingredientes deve ser um array' });
    }
    
    
    const createdIngredients = await Promise.all(ingredients.map(async (ingredientData) => {
      const { ingredientName, unitOfMeasureUnit, quantity } = ingredientData;

      const unitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasureUnit });
      const ingredient = await Ingredient.findOne({ name: ingredientName });

      if (!ingredient || !unitOfMeasure) {
        return res.status(404).json({ message: 'Ingrediente ou unidade de medida não encontrados' });
      }

      const ingredientRecipe = new IngredientRecipe({
        recipe: recipeId,
        ingredient: ingredient._id,
        quantity: quantity,
        unitOfMeasure: unitOfMeasure,
      });

      return await ingredientRecipe.save();
    }));

    res.status(201).json(createdIngredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function calculateCost(ingredientsRecipe) {
  let totalCost = 0;

  for (const { recipe, ingredient, quantity, unitOfMeasure } of ingredientsRecipe) {
    const ingrediente = await Ingredient.findById(ingredient).populate('idUnitOfMeasure').exec();
    const recipeIngredientUnit = unitOfMeasure.unit;

    if (recipeIngredientUnit !== ingrediente.idUnitOfMeasure.unit) {
      const convertedQuantity = convertUnitOfMeasure(quantity, recipeIngredientUnit, ingrediente.idUnitOfMeasure.unit);
      const cost = (convertedQuantity / ingrediente.quantity) * ingrediente.price;
      totalCost += cost;
    } else {
      const cost = (quantity / ingrediente.quantity) * ingrediente.price;
      totalCost += cost;
    }
  }
  
  return totalCost;
}


function convertUnitOfMeasure(quantity, recipeUnit, ingredientUnit) {
  if (recipeUnit === "Kilograma" && ingredientUnit === "Gramas") {
    return quantity * 1000
  } else if (recipeUnit === "Gramas" && ingredientUnit === "Kilograma") {
    return quantity / 1000
  } else {
    throw new Error(`Unidades incompatíveis para conversão ${quantity} ${recipeUnit} ${ingredientUnit} `);
  }
}

export {
  addIngredientsToRecipe,
  getAllIngredientsRecipe
};
