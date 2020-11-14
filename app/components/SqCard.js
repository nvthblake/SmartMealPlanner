import React from "react";
import { View, StyleSheet, Image, TouchableWithoutFeedback } from "react-native";
// import {  } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";

function SqCard({ title, subTitle1, subTitle2, image, expStatus, screenWidth, onPress, onLongPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.card,
          {
            height: (0.85 * screenWidth) / 3,
            width: (0.85 * screenWidth) / 3,
            marginBottom: 0.05 * screenWidth,
            // borderColor: expStatus,
          },
        ]}
      >
        <Image 
          style={[styles.image, { marginTop: ((0.85 * screenWidth) / 3)*0.025 }]} 
          source={{uri: image}} />
        <View style={styles.detailsContainer}>
          <AppText style={[styles.title, { fontSize: 0.03 * screenWidth }]}>
            {title}
          </AppText>
          <AppText style={[styles.subTitle, { fontSize: 0.025 * screenWidth }]}>
            {subTitle1}
          </AppText>
          <AppText style={[styles.subTitle, { fontSize: 0.025 * screenWidth, color: expStatus }]}>
            {subTitle2}
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
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "95%",
    height: "58%",
    borderRadius: 12,
    borderColor: colors.white,
    overflow: "hidden",
  },
  title: {
    // fontSize: 4,
    // marginVertical: 5,
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: colors.black,
    fontWeight: "bold",
  },
  subTitle: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.primary,
    color: colors.dark,
  },
});
export default SqCard;
