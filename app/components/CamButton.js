import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import colors from "../config/colors";

function CamButton({
  // borderColor,
  title,
  onPress,
  color = colors.primary,
  size = 18,
  textColor = colors.white,
  height = 30,
  icon,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color, height: height, borderRadius: height / 2 },
      ]}
      onPress={onPress}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={30}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={
          ([styles.text],
          { fontSize: size, color: textColor, fontWeight: "bold" })
        }
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    margin: 2,
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default CamButton;
