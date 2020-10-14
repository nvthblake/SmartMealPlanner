import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function AppButton({ title, onPress, color = "white", size = 13 }) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }]}
      onPress={onPress}
    >
      <Text style={[styles.text], {fontSize: size,}}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderRadius: 25,
    borderColor: colors.primary,
    borderWidth:2 ,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 2,
    marginTop: 10,
    marginBottom: 15
  },
  text: {
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
