import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Constants from "expo-constants";

import MealPlanTab from "../tabs/MealPlanTab";
import RecipeTab from "../tabs/RecipeTab";
import colors from "../config/colors";

const Tab = createMaterialTopTabNavigator();

const RecipeNavigator = () => (
  <Tab.Navigator
    swipeEnabled={false}
    tabBarOptions={{
      indicatorStyle: { backgroundColor: colors.primary },
      labelStyle: { fontWeight: "bold" },
      activeTintColor: colors.primary,
      style: { marginTop: Constants.statusBarHeight },
    }}
  >
    <Tab.Screen name="Meal Planner" component={MealPlanTab} />
    <Tab.Screen name="Explore" component={RecipeTab} />
  </Tab.Navigator>
);

export default RecipeNavigator;
