import React from "react";
import { Text } from "react-native";

import defaultStyles from "../config/styles";

function AppText({ children, style, fontSize, ...otherProps }) {
  return (
    <Text
      style={[defaultStyles.text, style, { fontSize: fontSize }]}
      adjustsFontSizeToFit
      {...otherProps}
    >
      {children}
    </Text>
  );
}

export default AppText;
