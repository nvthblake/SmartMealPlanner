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