import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import AppText from "./AppText";
import Slider from "@react-native-community/slider";
import Screen from "./Screen";

function CustomSlider({ value }) {
  const [measure, setMeasure] = useState(0);
  return (
    <View style={[styles.container, {}]}>
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
  );
}
const styles = StyleSheet.create({
  container: {
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

export default CustomSlider;
