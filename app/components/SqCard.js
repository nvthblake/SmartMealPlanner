import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function SqCard({ title, subTitle, image, expStatus, screenWidth, onPress, onLongPress }) {
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.card,
          {
            height: (0.8 * screenWidth) / 3,
            width: (0.8 * screenWidth) / 3,
            marginBottom: 0.05 * screenWidth,
            borderColor: expStatus,
          },
        ]}
      >
        <Image style={styles.image} source={{uri: image}} />
        <View style={styles.detailsContainer}>
          <AppText style={[styles.subTitle, { fontSize: 0.03 * screenWidth }]}>
            {subTitle}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: colors.primary,
    overflow: "hidden",
    alignItems: "center",
    elevation: 10,
  },
  detailsContainer: {
    alignContent: "center",
  },
  image: {
    width: "100%",
    height: "85%",
    overflow: "hidden",
  },
  title: {
    fontSize: 10,
    marginBottom: 7,
  },
  subTitle: {
    flex: 1,
    alignItems: "center",
    alignContent: "center",
    // backgroundColor: colors.primary,
    color: colors.white,
    fontWeight: "bold",
  },
});
export default SqCard;
