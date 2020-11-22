import { combineReducers } from "redux";
import {
  ADD_INGREDIENT_TO_CART,
  ADD_INGREDIENT_TO_FRIDGE,
  CLEAR_INGREDIENTS_IN_FRIDGE,
  UPDATE_INGREDIENT_IN_FRIDGE,
  DELETE_INGREDIENT_IN_FRIDGE,
  CLEAN_ZEROED_INGREDIENTS_IN_FRIDGE,
  // to scan
  ADD_INGREDIENT_TO_SCAN,
  DELETE_INGREDIENT_TO_SCAN,
  CLEAR_INGREDIENTS_TO_SCAN,
  CLEAR_CART,
  DELETE_INGREDIENT_IN_CART,
  // Recipes
  ADD_RECIPE,
  CLEAR_RECIPE,
  // Meal Plan
  ADD_MEAL_PLAN,
  DELETE_MEAL_PLAN,
  CLEAR_MEAL_PLAN,
  // Favorite Recipes
  ADD_FAVORITE_RECIPE,
  DELETE_FAVORITE_RECIPE,
  CLEAR_FAVORITE_RECIPE,
  SET_SCAN_PREDICTED_NAMES
} from "./types";

const today = new Date();

const INITIAL_STATE = {
  fridge: [
    {
      id: 1,
      ingredient: "Apple",
      category: "Fruit",
      qty: 100,
      expDate: today,
      unit: "Kg",
      imageUri:
        "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg",
    },
  ],
  cart: [],
  recipes: [],
  ingredientToScan: [
    // {
    //   imageUri: "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg"
    // }
  ],
  mealPlanner: [],
  favoriteRecipes: [],
  scanPredictedNames: []
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  let {
    fridge,
    cart,
    recipes,
    ingredientToScan,
    mealPlanner,
    favoriteRecipes,
    scanPredictedNames
  } = state;
  let newState;
  switch (action.type) {
    case ADD_INGREDIENT_TO_FRIDGE:
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time

      fridge.push(action.payload);

      // Finally, update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case ADD_INGREDIENT_TO_CART:
      cart.push(action.payload);
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case ADD_RECIPE:
      recipes.push(action.payload);
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_RECIPE:
      recipes = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_INGREDIENTS_IN_FRIDGE:
      fridge = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case UPDATE_INGREDIENT_IN_FRIDGE:
      // Change value of ingredient chosen
      const ingreIndexUpdate = fridge.findIndex(
        (ingre) => ingre.id === action.payload.id
      );
      fridge[ingreIndexUpdate] = action.payload;

      // Update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case DELETE_INGREDIENT_IN_FRIDGE:
      // Delete ingredient chosen
      const ingreIndexDelete = fridge.findIndex(
        (ingre) => ingre.id === action.payload.id
      );
      fridge.splice(ingreIndexDelete, 1);

      // Update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAN_ZEROED_INGREDIENTS_IN_FRIDGE:
      // Filter fridge to only ingredients whose quanty > 0
      fridge = fridge.filter(function (ingre) {
        return ingre.qty > 0;
      });

      // Update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case ADD_INGREDIENT_TO_SCAN:
      ingredientToScan.push(action.payload);
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case DELETE_INGREDIENT_TO_SCAN:
      // Delete ingredient chosen
      const ingreScanIndexDelete = ingredientToScan.findIndex(
        (ingre) => ingre.imageUri === action.payload
      );
      ingredientToScan.splice(ingreScanIndexDelete, 1);

      // Update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_INGREDIENTS_TO_SCAN:
      ingredientToScan = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case ADD_MEAL_PLAN:
      mealPlanner.push(action.payload);
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_CART:
      cart = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case DELETE_INGREDIENT_IN_CART:
      // Delete ingredient chosen
      const spliceIndex = cart.findIndex(
        (ingre) => ingre.id === action.payload.id
      );
      cart.splice(spliceIndex, 1);

      // Update the redux state
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case DELETE_MEAL_PLAN:
      const mealPlanIndexDelete = favoriteRecipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      favoriteRecipes.splice(mealPlanIndexDelete, 1);

      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_MEAL_PLAN:
      mealPlanner = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case ADD_FAVORITE_RECIPE:
      favoriteRecipes.push(action.payload);
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case DELETE_FAVORITE_RECIPE:
      const favoriteRecipesIndexDelete = favoriteRecipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      favoriteRecipes.splice(favoriteRecipesIndexDelete, 1);

      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case CLEAR_FAVORITE_RECIPE:
      favoriteRecipes = [];
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    case SET_SCAN_PREDICTED_NAMES:
      scanPredictedNames = action.payload
      console.log("yay", scanPredictedNames)

      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;

    default:
      newState = {
        fridge,
        cart,
        recipes,
        ingredientToScan,
        mealPlanner,
        favoriteRecipes,
        scanPredictedNames
      };
      return newState;
  }
};

export default combineReducers({
  ingredients: ingredientsReducer,
});
