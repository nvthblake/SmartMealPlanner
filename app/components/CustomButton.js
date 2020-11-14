import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

import colors from "../config/colors";

function CustomButton({
  borderColor = colors.primary,
  title,
  onPress,
  color = colors.white,
  size = 13,
  textColor = colors.primary,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, borderColor: borderColor, height: size + 15 },
      ]}
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
    borderRadius: 12,
    borderColor: colors.medium,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    margin: 2,
    marginTop: 10,
    marginBottom: 15,
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default CustomButton;
