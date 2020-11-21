import React from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import colors from "../config/colors";

function AppTextInput({
  icon,
  title,
  width = "100%",
  marginHorizontal = 0,
  marginLeft = 0,
  marginRight = 0,
  ...otherProps
}) {
  return (
    <View
      style={[
        styles.container,
        { width, marginHorizontal, marginLeft, marginRight },
      ]}
    >
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.grey}
        style={(defaultStyles.text, { flex: 1, fontSize: 18 })}
        placeholder={title}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.white,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 25,
    flexDirection: "row",
    paddingLeft: 8,
    height: 50,
    alignItems: "center",
    marginVertical: 4,
  },
  icon: {
    marginRight: 10,
  },
});

export default AppTextInput;
