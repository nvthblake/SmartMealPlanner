import { ADD_INGREDIENT_TO_FRIDGE, ADD_INGREDIENT_TO_CART, ADD_RECIPE, CLEAR_RECIPE } from './types';

export const addIngredientToFridge = (ingredient) => (
    {
        type: ADD_INGREDIENT_TO_FRIDGE,
        payload: ingredient
    }
);

export const addIngredientToCart = (ingredient) => (
    {
        type: ADD_INGREDIENT_TO_CART,
        payload: ingredient
    }
);

export const addRecipe = (recipe) => (
    {
        type: ADD_RECIPE,
        payload: recipe
    }
)

export const clearRecipe = () => (
    {
        type: CLEAR_RECIPE
    }
)