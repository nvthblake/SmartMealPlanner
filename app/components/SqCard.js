import React from "react";
import { View, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
// import {  } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";

function SqCard({ title, subTitle, image, expStatus, screenWidth, onPress, onLongPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.card,
          {
            height: (0.8 * screenWidth) / 3,
            width: (0.8 * screenWidth) / 3,
            marginBottom: 0.05 * screenWidth,
            // borderColor: expStatus,
          },
        ]}
      >
        <Image style={styles.image} source={{uri: image}} />
        <View style={styles.detailsContainer}>
          <AppText style={[styles.title, {fontSize: 0.06 * screenWidth }]}>
            {title}
          </AppText>
          <AppText style={[styles.subTitle, { fontSize: 0.03 * screenWidth }]}>
            {subTitle}
          </AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    // borderWidth: 2,
    backgroundColor: colors.white,
    overflow: "hidden",
    alignItems: "center",
    elevation: 10,
  },
  detailsContainer: {
    alignContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
    // margin: 5,
    flex: 1,
    overflow: "hidden",
  },
  title: {
    // fontSize: 10,
    marginVertical: 5,
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: colors.black,
    fontWeight: "bold",
  },
  subTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.primary,
    color: colors.black,
    // fontWeight: "bold",
  },
});
export default SqCard;
