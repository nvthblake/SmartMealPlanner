import { any } from '@tensorflow/tfjs';
import { 
    ADD_INGREDIENT_TO_FRIDGE, 
    ADD_INGREDIENT_TO_CART, 
    ADD_RECIPE, 
    CLEAR_RECIPE, 
    CLEAR_INGREDIENTS_IN_FRIDGE, 
    UPDATE_INGREDIENT_IN_FRIDGE, 
    DELETE_INGREDIENT_IN_FRIDGE,
    ADD_INGREDIENT_TO_SCAN,
    DELETE_INGREDIENT_TO_SCAN,
    CLEAR_INGREDIENTS_TO_SCAN,
    CLEAR_CART,
    DELETE_INGREDIENT_IN_CART,
    ADD_MEAL_PLAN,
    DELETE_MEAL_PLAN,
    CLEAR_MEAL_PLAN,
    TOGGLE_FAVORITE_RECIPE,
    DELETE_FAVORITE_RECIPE,
    CLEAR_FAVORITE_RECIPE,
} from './types';

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

export const clearCart = () => (
    {
        type: CLEAR_CART
    }
)

export const clearIngredientsInFridge = () => (
    {
        type: CLEAR_INGREDIENTS_IN_FRIDGE
    }
)

export const updateIngredientInFridge = (ingredient) => (
    {
        type: UPDATE_INGREDIENT_IN_FRIDGE,
        payload: ingredient
    }
)

export const deleteIngredientInFridge = (ingredient) => (
    {
        type: DELETE_INGREDIENT_IN_FRIDGE,
        payload: ingredient
    }
)

export const deleteIngredientInCart = (ingredient) => (
    {
        type: DELETE_INGREDIENT_IN_CART,
        payload: ingredient
    }
)

export const addIngredientToScan = (ingredientToScan, ingredientToScanID) => (
    {
        type: ADD_INGREDIENT_TO_SCAN,
        payload: ingredientToScan, ingredientToScanID
    }
)

export const deleteIngredientToScan = (ingredientToScan) => (
    {
        type: DELETE_INGREDIENT_TO_SCAN,
        payload: ingredientToScan
    }
)

export const clearIngredientsToScan = () => (
    {
        type: CLEAR_INGREDIENTS_TO_SCAN
    }
)

// Meal Plan
export const addMealPlan = (mealplan) => (
    {
        type: ADD_MEAL_PLAN,
        payload: mealplan
    }
)

export const deleteMealPlan = (mealplan) => (
    {
        type: DELETE_MEAL_PLAN,
        payload: mealplan
    }
)

export const clearMealPlan = () => (
    {
        type: CLEAR_MEAL_PLAN,
    }
)

// Favorite Recipe
export const toggleFavoriteRecipe = (recipe) => (
    {
        type: TOGGLE_FAVORITE_RECIPE,
        payload: recipe
    }
)

export const deleteFavoriteRecipe = (recipe) => (
    {
        type: DELETE_FAVORITE_RECIPE,
        payload: recipe
    }
)

export const clearFavoriteRecipe = () => (
    {
        type: CLEAR_FAVORITE_RECIPE,
    }
)