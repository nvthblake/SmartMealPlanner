import { ADD_INGREDIENT_TO_FRIDGE } from './types';

export const addIngredientToFridge = (ingredient) => (
    {
        type: ADD_INGREDIENT_TO_FRIDGE,
        payload: ingredient
    }
);
