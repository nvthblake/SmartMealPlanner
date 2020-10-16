import { combineReducers } from 'redux';
import { ADD_INGREDIENT } from './types';

const INITIAL_STATE = {
    current: [
        {
            id: 1,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'red',
            image: require("./app/assets/appIcon/ingredients.png"),
        },
        {
            id: 2,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'red',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 3,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'red',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 4,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'orange',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 5,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'orange',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 6,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'yellow',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 7,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'yellow',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 8,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'green',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 9,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'green',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 10,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'red',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 11,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'red',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 12,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'red',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 13,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'red',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 14,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'orange',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 15,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'orange',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 16,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'yellow',
            image: require("./app/assets/couch.jpg"),
        },
        {
            id: 17,
            title: "Red Dude for sale",
            qty: 100,
            exp: 'yellow',
            image: require("./app/assets/jacket.jpg"),
        },
        {
            id: 18,
            title: "Couch with all kinds of stain",
            qty: 1000,
            exp: 'green',
            image: require("./app/assets/couch.jpg"),
        },

    ],
    shoppingList: []
};

const ingredientsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADD_INGREDIENT:
            // Pulls current and possible out of previous state
            // We do not want to alter state directly in case
            // another action is altering it at the same time
            const { current, shoppingList } = state;

            current.push(addedFriend);

            // Finally, update the redux state
            const newState = { current, shoppingList };

            return newState;
        default:
            return state
    }
};

export default combineReducers({
    ingredients: ingredientsReducer
});
