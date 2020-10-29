import React from "react";
import {
  createStackNavigator,
  Header,
  HeaderBackground,
} from "@react-navigation/stack";

import CameraPage from "../tabs/pages/CameraPage";
import ScanTab from "../tabs/ScanTab";
import colors from "../config/colors";

const Stack = createStackNavigator();

const CamNavigation = () => (
  <Stack.Navigator mode={"modal"} screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ScanTab" component={ScanTab} />
    <Stack.Screen
      name="Camera"
      component={CameraPage}
      options={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: colors.medium,
      }}
    />
  </Stack.Navigator>
);

export default CamNavigation;
