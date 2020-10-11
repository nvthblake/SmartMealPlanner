import React from "react";

import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
  Text,
} from "react-native";
import {
  useDimensions,
  useDeviceOrientation,
} from "@react-native-community/hooks";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import AppText from "./App/components/AppText/AppText";
import WelcomeScreen from "./app/screens/WelcomeScreen";
import ViewImageScreen from "./app/screens/ViewImageScreen";
import AppButton from "./App/components/AppButton";
import Card from "./App/components/Card";

export default function App() {
  return (
    <View
      style={{
        backgroundColor: "#f8f4f4",
        padding: 20,
        paddingTop: 100,
      }}
    >
      <Card
        title="Red dude for sale"
        subTitle="$100"
        image={require("./App/assets/jacket.jpg")}
      />
    </View>
  );
}
