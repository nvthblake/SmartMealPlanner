import { combineReducers } from "redux";
import {
  ADD_INGREDIENT_TO_CART,
  ADD_INGREDIENT_TO_FRIDGE,
  ADD_RECIPE,
  CLEAR_RECIPE,
  CLEAR_INGREDIENTS_IN_FRIDGE,
  UPDATE_INGREDIENT_IN_FRIDGE,
  DELETE_INGREDIENT_IN_FRIDGE,
  ADD_INGREDIENT_TO_SCAN,
  DELETE_INGREDIENT_TO_SCAN,
  CLEAR_INGREDIENTS_TO_SCAN,
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
      imageUri: "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg",
    }
  ],
  cart: [],
  recipes: [],
  ingredientToScan: [
    // {
    //   imageUri: "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg"
    // }
  ]
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  let { fridge, cart, recipes, ingredientToScan } = state;
  let newState;
  switch (action.type) {
    case ADD_INGREDIENT_TO_FRIDGE:
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time

      fridge.push(action.payload);

      // Finally, update the redux state
      newState = { fridge, cart, recipes, ingredientToScan };

      return newState;

    case ADD_INGREDIENT_TO_CART:
      cart.push(action.payload);
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    case ADD_RECIPE:
      recipes.push(action.payload);
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    case CLEAR_RECIPE:
      recipes = [];
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    case CLEAR_INGREDIENTS_IN_FRIDGE:
      fridge = [];
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    case UPDATE_INGREDIENT_IN_FRIDGE:

      // Change value of ingredient chosen
      const ingreIndexUpdate = fridge.findIndex((ingre => ingre.id === action.payload.id));
      fridge[ingreIndexUpdate] = action.payload;

      // Update the redux state
      newState = { fridge, cart, recipes, ingredientToScan };

      return newState;

    case DELETE_INGREDIENT_IN_FRIDGE:

      // Delete ingredient chosen
      const ingreIndexDelete = fridge.findIndex((ingre => ingre.id === action.payload.id));
      fridge.splice(ingreIndexDelete, 1);

      // Update the redux state
      newState = { fridge, cart, recipes, ingredientToScan };

      return newState;

    case ADD_INGREDIENT_TO_SCAN:

      ingredientToScan.push(action.payload);
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    case DELETE_INGREDIENT_TO_SCAN:
      // Delete ingredient chosen
      const ingreScanIndexDelete = ingredientToScan.findIndex((ingre => ingre.imageUri === action.payload));
      ingredientToScan.splice(ingreScanIndexDelete, 1);

      // Update the redux state
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState

    case CLEAR_INGREDIENTS_TO_SCAN:
      ingredientToScan = [];
      newState = { fridge, cart, recipes, ingredientToScan };
      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  ingredients: ingredientsReducer,
});
