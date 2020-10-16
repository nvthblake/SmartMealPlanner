import { StatusBar } from "expo-status-bar";
import React from "react";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AccountScreen from "./app/screens/AccountScreen";
import ListingDetailsScreen from "./app/screens/ListingDetailsScreen";
import ListingEditScreen from "./app/screens/ListingEditScreen";
import LoginScreen from "./app/screens/LoginScreen";
import MessagesScreen from "./app/screens/MessagesScreen";
import ViewImageScreen from "./app/screens/ViewImageScreen";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import navigationTheme from "./app/navigation/navigationTheme";
import Icon from "./app/components/Icon";
import colors from "./app/config/colors";
import IngredientsTab from "./app/tabs/IngredientsTab";

// Redux Territory
import ingredientsReducer from './IngredientsReducer';

const store = createStore(ingredientsReducer);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
// export default function App() {
//   return ( <IngredientsTab/> 
//   );
// }
