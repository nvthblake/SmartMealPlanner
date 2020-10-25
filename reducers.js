import { combineReducers } from "redux";
import {
  ADD_INGREDIENT_TO_CART,
  ADD_INGREDIENT_TO_FRIDGE,
  ADD_RECIPE,
  CLEAR_RECIPE,
  CLEAR_INGREDIENTS_IN_FRIDGE,
  UPDATE_INGREDIENT_IN_FRIDGE
} from "./types";

const today = new Date();

const INITIAL_STATE = {
  fridge: [
    // {
    //   id: 1,
    //   ingredient: "Apple",
    //   category: "Fruit",
    //   qty: 100,
    //   expDate: today,
    //   unit: "Kg",
    //   imageUri: "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg",
    // },
  ],
  cart: [],
  recipes: [],
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
  let { fridge, cart, recipes } = state;
  let newState;
  switch (action.type) {
    case ADD_INGREDIENT_TO_FRIDGE:
      // Pulls current and possible out of previous state
      // We do not want to alter state directly in case
      // another action is altering it at the same time

      fridge.push(action.payload);

      // Finally, update the redux state
      newState = { fridge, cart, recipes };

      return newState;

    case ADD_INGREDIENT_TO_CART:
      cart.push(action.payload);
      newState = { fridge, cart, recipes };
      return newState;

    case ADD_RECIPE:
      recipes.push(action.payload);
      newState = { fridge, cart, recipes };
      return newState;

    case CLEAR_RECIPE:
      recipes = [];
      newState = { fridge, cart, recipes };
      return newState;

    case CLEAR_INGREDIENTS_IN_FRIDGE:
      fridge = [];
      newState = { fridge, cart, recipes };
      return newState;

    case UPDATE_INGREDIENT_IN_FRIDGE:

      // Change value of ingredient chosen
      const ingreIndex = fridge.findIndex((ingre => ingre.id === action.payload.id));
      fridge[ingreIndex] = action.payload;

      // Update the redux state
      newState = { fridge, cart, recipes };

      return newState;

    default:
      return state;
  }
};

export default combineReducers({
  ingredients: ingredientsReducer,
});
