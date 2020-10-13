import React from "react";
import { View, StyleSheet, Image } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function SqCard({ title, subTitle, image, expStatus, screenWidth }) {
  return (
    <View style={[styles.card, {height: (0.8*screenWidth)/3, width: (0.8*screenWidth)/3, marginBottom: 0.05*screenWidth, borderColor: expStatus,}]}>
      <Image style={styles.image} source={image} />
      <View style={styles.detailsContainer}>
        <AppText style={[styles.subTitle, {fontSize: 0.03*screenWidth}]}>{subTitle}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    borderWidth: 2,
    backgroundColor: colors.white,
    overflow: "hidden",
    alignItems: "center",
    elevation: 10,
  },
  detailsContainer: {
    alignContent: "center"
  },
  image: {
    width: "100%",
    height: "85%",
    borderRadius: 10,
  },
  title: {
    fontSize: 10,
    marginBottom: 7,
  },
  subTitle: {
    alignItems: "center",
    alignContent:"center",
    color: colors.secondary,
    fontWeight: "bold",
    
  },
});
export default SqCard;
