import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function CircularOverview({
  stat,
  title,
  title2 = null,
  size,
  fontSize = 16,
  fontColor = "black",
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: size,
          height: size,
          backgroundColor: "#F3F6F9",
          borderRadius: Math.floor(size / 2),
          borderWidth: 2,
          borderColor: "#3E73FB",
        }}
      >
        <Text
          numberOfLines={2}
          style={{ fontWeight: "400", fontSize: fontSize, color: fontColor }}
        >
          {stat}
        </Text>
      </View>
      <Text style={{ color: "gray", paddingTop: 4 }}>{title}</Text>
      {title2 && <Text style={{ color: "gray" }}>{title2}</Text>}
    </TouchableOpacity>
  );
}
