import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';

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
import ScanTab from "./app/tabs/ScanTab";

const db = SQLite.openDatabase("db2.db");


// export default function App() {
//   return ( <NavigationContainer>
//     <AppNavigator />
//   </NavigationContainer> 
//   );
// }

export default function App() {

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS FactFridge \
        (id INTEGER PRIMARY KEY NOT NULL, \
        createdTs DATETIME DEFAULT CURRENT_TIMESTAMP, 
        ingredient VARCHAR NOT NULL, 
        qty INTEGER NOT NULL, 
        unit VARCHAR NOT NULL, 
        category VARCHAR NOT NULL, 
        dayToExp INTEGER NOT NULL, 
        expDate DATETIME NULL,
        inFridge INT(1));`
      );
    });
  }, []);

  return ( <ScanTab/> 
  );
}
