import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function CustomButton({
  // borderColor,
  title,
  onPress,
  color = colors.primary,
  size = 15,
  textColor = colors.white,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color, height: 30 }]}
      onPress={onPress}
    >
      <Text style={([styles.text], { fontSize: size, color: textColor })}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    // borderColor:,
    // borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 2,
    marginTop: 10,
    // marginBottom: 15,
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default CustomButton;
