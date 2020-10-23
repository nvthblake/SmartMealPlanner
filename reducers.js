import { combineReducers } from "redux";
import {
  ADD_INGREDIENT_TO_CART,
  ADD_INGREDIENT_TO_FRIDGE,
  ADD_RECIPE,
  CLEAR_RECIPE,
} from "./types";

const INITIAL_STATE = {
  fridge: [
    {
      id: 1,
      title: "Apple",
      categoryName: "Fruit",
      quantity: 100,
      expirationDate: "red",
      imageUrl: require("./app/assets/appIcon/Honeycrisp.jpg"),
    },
    {
      id: 2,
      title: "Banana",
      categoryName: "Fruit",
      quantity: 1000,
      expirationDate: "yellow",
      imageUrl: require("./app/assets/appIcon/bananas.jpg"),
    },
    {
      id: 3,
      title: "Ground Beef",
      categoryName: "Meat",
      quantity: 10,
      expirationDate: "green",
      imageUrl: require("./app/assets/appIcon/steak.jpg"),
    },
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

    default:
      return state;
  }
};

export default combineReducers({
  ingredients: ingredientsReducer,
});
