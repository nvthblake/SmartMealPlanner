import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import AppText from "./AppText";
import Slider from "@react-native-community/slider";
import Screen from "./Screen";
import CustomSlider from "./CustomSlider";

function IngredientSlider({ title = "Placeholder", value }) {
  const screenWidth = Dimensions.get("window").width;
  const [measure, setMeasure] = useState(0);
  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={{ width: 50, textAlign: "center" }}>{title}</AppText>
        </View>
        <View style={[styles.sliderContainer, {}]}>
          <View>
            <View style={styles.tickContainer}>
              <View style={[styles.tickView]}>
                <AppText fontSize={10}>None</AppText>
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tickShort} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tick} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tickShort} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tick} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tickShort} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tick} />
              </View>
              <View style={[styles.tickView]}>
                <View style={styles.tickShort} />
              </View>
              <View style={[styles.tickView]}>
                <AppText fontSize={10}>All</AppText>
              </View>
            </View>
          </View>
          <Slider
            style={{ width: "97%" }}
            minimumValue={0}
            maximumValue={1}
            step={0.125}
            onValueChange={(input) => {
              setMeasure(input);
              value = measure;
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 30,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  textContainer: {
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  sliderContainer: {
    // height: 150,
    // flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "red",
  },
  text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // fontSize: 20,
  },
  tickShort: {
    height: 4,
    width: 1,
    backgroundColor: "black",
  },
  tick: {
    height: 8,
    width: 1,
    backgroundColor: "black",
  },
  tickView: {
    // paddingHorizontal: 25,
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tickContainer: {
    // backgroundColor: "blue",
    // marginLeft: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default IngredientSlider;
