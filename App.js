import { StatusBar } from "expo-status-bar";
import React from "react";
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
import Profile from "./app/tabs/Profile";

export default function App() {
  return ( 
    <Profile/>
  );
}


// Uncomment the following to test the Navigation Function
// export default function App() {
//   return ( 
//   <NavigationContainer>
//     <AppNavigator/>
//   </NavigationContainer> 
//   );
// }