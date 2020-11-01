import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { color } from "react-native-reanimated";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AddItemButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={colors.white}
          size={40}
        />
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 30,
    borderColor: colors.white,
    borderWidth: 8,
    height: 60,
    width: 60,
    bottom: 15,
  },
});

export default AddItemButton;
