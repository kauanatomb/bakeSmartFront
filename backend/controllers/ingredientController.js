import { Ingredient } from '../models/ingredientModel.js';
import { Category } from '../models/categoryModel.js'
import { UnitOfMeasure } from '../models/unitOfMeasureModel.js'

const getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find()
      .populate('idCategory', 'name')
      .populate('idUnitOfMeasure', 'unit abbreviation');

    res.json({
      count: ingredients.length, 
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = async (req, res) => {
  const { name, quantity, brand, idCategory, idUnitOfMeasure, price } = req.body;

  try {
    let findCategory = await Category.findOne({ name: idCategory });
    let findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: idUnitOfMeasure });

    if (!findCategory) {
      return res.status(404).json({ message: `Categoria '${idCategory}' não encontrada.` });
    }

    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: `Unidade de medida '${idUnitOfMeasure}' não encontrada.` });
    }

    const newIngredient = await Ingredient.create({
      name,
      quantity,
      brand,
      idCategory: findCategory._id,
      idUnitOfMeasure: findUnitOfMeasure._id,
      price,
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, brand, idCategory, idUnitOfMeasure, price } = req.body;

    if (!idCategory || !idUnitOfMeasure) {
      return res.status(400).json({ message: 'Category and unit of measure are required' });
    }

    const findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: idUnitOfMeasure })

    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const findCategory = await Category.findOne({ name: idCategory })

    if (!findCategory) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      id,
      {
        name,
        quantity,
        brand,
        idCategory: findCategory._id,
        idUnitOfMeasure: findUnitOfMeasure._id,
        price,
      },
      { new: true }
    );

    if (!updatedIngredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.json(updatedIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export {
  getAllIngredients,
  createIngredient,
  updateIngredient,
};
