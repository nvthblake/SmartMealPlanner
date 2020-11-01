import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import CameraPage from "../tabs/pages/CameraPage";
import ScanTab from "../tabs/ScanTab";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const CamNavigation = () => (
  <Stack.Navigator
    mode={"modal"}
    headerMode={"screen"}
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="ScanTab" component={ScanTab} />
    <Stack.Screen
      name="Camera"
      component={CameraPage}
      options={{
        headerBackImage: () => (
          <MaterialCommunityIcons name="close" size={24} color="black" />
        ),
        // headerBackTitleVisible: true,
        // headerTitle: "",
        headerShown: true,
        // headerTransparent: true,
        headerTintColor: colors.primary,
      }}
    />
  </Stack.Navigator>
);

export default CamNavigation;
