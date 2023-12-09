import mongoose from 'mongoose'

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  idCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  idUnitOfMeasure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UnitOfMeasure'
  },
  price: {
    type: Number,
    required: true
  }
});

export const Ingredient = mongoose.model('Ingredient', ingredientSchema);
