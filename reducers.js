import { combineReducers } from 'redux';
import { ADD_INGREDIENT_TO_CART, ADD_INGREDIENT_TO_FRIDGE } from './types';

const INITIAL_STATE = {
    fridge: [
        {
            id: 1,
            title: "Red Dude for sale",
            categoryName: "Meat",
            quantity: 100,
            expirationDate: "red",
            imageUrl: require("./app/assets/appIcon/ingredients.png"),
        },
        {
            id: 2,
            title: "Couch with all kinds of stain",
            categoryName: "Condiment",
            quantity: 1000,
            expirationDate: "red",
            imageUrl: require("./app/assets/couch.jpg"),
        },
        {
            id: 3,
            title: "Couch with all kinds of stain",
            categoryName: "Condiment",
            quantity: 10,
            expirationDate: "red",
            imageUrl: require("./app/assets/couch.jpg"),
        }
    ],
    cart: []
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
    const { fridge, cart } = state;
    let newState;
    switch (action.type) {
        case ADD_INGREDIENT_TO_FRIDGE:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time

            fridge.push(action.payload);

            // Finally, update the redux state
            newState = { fridge, cart };

            return newState;

        case ADD_INGREDIENT_TO_CART:
            cart.push(action.payload);
            newState = { fridge, cart };
            return newState;

        default:
            return state
    }
};

export default combineReducers({
    ingredients: ingredientsReducer
});
