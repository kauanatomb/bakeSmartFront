import { Ingredient } from '../models/ingredientModel.js';
import { Category } from '../models/categoryModel.js'
import { UnitOfMeasure } from '../models/unitOfMeasureModel.js'
import { IngredientRecipe } from '../models/ingredientRecipeModel.js';

const getAllIngredients = async (req, res) => {
  try {
    const userId = req.user.id
    const ingredients = await Ingredient.find({ owner: userId })
      .populate('category', 'name')
      .populate('unitOfMeasure', 'unit abbreviation');

    res.json({
      count: ingredients.length, 
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createIngredient = async (req, res) => {
  const { name, quantity, brand, category, unitOfMeasure, price } = req.body;
  const userId = req.user.id

  try {
    let findCategory = await Category.findOne({ name: category });
    let findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasure });

    if (!findCategory) {
      return res.status(404).json({ message: `Category '${category}' not found.` });
    }

    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: `Unit of measure '${unitOfMeasure}' not found.` });
    }

    const newIngredient = await Ingredient.create({
      name,
      quantity,
      brand,
      category: findCategory._id,
      unitOfMeasure: findUnitOfMeasure._id,
      price,
      owner: userId
    });

    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id
    const { name, quantity, brand, category, unitOfMeasure, price } = req.body;

    if (!category || !unitOfMeasure) {
      return res.status(400).json({ message: 'Category and unit of measure are required' });
    }

    const findUnitOfMeasure = await UnitOfMeasure.findOne({ unit: unitOfMeasure })

    if (!findUnitOfMeasure) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const findCategory = await Category.findOne({ name: category })

    if (!findCategory) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    const updatedIngredient = await Ingredient.findByIdAndUpdate( id, 
      {
        name,
        quantity,
        brand,
        category: findCategory._id,
        unitOfMeasure: findUnitOfMeasure._id,
        price,
        owner: userId
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

const deleteOneIngredient = async (req, resp) => {
  try {
    const { id } = req.params;
    const userId = req.user.id

    IngredientRecipe.deleteMany({ ingredient: id, owner: userId })
    .then((result) => {
      console.log(`${result.deletedCount} documents removed with sucess!`);
    })
    .catch((error) => {
      console.error('Error to remove document:', error);
    });

    const result = await Ingredient.findByIdAndDelete(id);

    if (!result) {
      return resp.status(404).json({ message: 'Ingredient not found' });
    }

    return resp.status(200).send({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    console.log(error.message);
    resp.status(500).send({ message: error.message });
  }
};


const getOneIngredient = async (req, res) => {

  const { id } = req.params
  const userId = req.user.id
  try {
    const ingredient = await Ingredient.findOne({ _id: id, owner: userId })
      .populate('category')
      .populate('unitOfMeasure');

    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient not found' });
    }

    res.status(200).json( ingredient );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


export {
  getAllIngredients,
  createIngredient,
  updateIngredient,
  deleteOneIngredient,
  getOneIngredient
};
