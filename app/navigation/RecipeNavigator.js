import React, {Fragment} from "react";
import {SafeAreaView} from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Constants from "expo-constants";

import MealPlanTab from "../tabs/MealPlanTab";
import RecipeTab from "../tabs/RecipeTab";
import Screen from "../components/Screen";
import colors from "../config/colors";

const Tab = createMaterialTopTabNavigator();

const RecipeNavigator = () => (
  <Fragment>
    <SafeAreaView style={{ flex: 0, backgroundColor: 'white'}} />
    <Tab.Navigator
      swipeEnabled={false}
      tabBarOptions={{
        indicatorStyle: { backgroundColor: colors.primary },
        labelStyle: { fontWeight: "bold" },
        activeTintColor: colors.primary,
      }}
    >
      <Tab.Screen name="Meal Planner" component={MealPlanTab} />
      <Tab.Screen name="Explore" component={RecipeTab} />
    </Tab.Navigator>
  </Fragment>

);

export default RecipeNavigator;
