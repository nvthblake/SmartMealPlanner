import React from "react";
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  View,
} from "react-native";
import {
  useDimensions,
  useDeviceOrientation,
} from "@react-native-community/hooks";

export default function App() {
  return (
    // <SafeAreaView style={styles.container}>

    // </SafeAreaView>
    <View
      style={{
        backgroundColor: "#fff",
        flex: 1,
        flexDirection: "row", // This will set the main axis, e.g. horizontal axis is main if set in row
        justifyContent: "center", // justify along the main axis
        alignItems: "center", // does not work with wrapping
        // alignContent: "center", // is only for wrapping, otherwise it does not work
        // flexWrap: "wrap", // wrap will make sure all the content will stay the same size, and will be added to the new line if neeeded
      }}
    >
      <View
        style={{
          backgroundColor: "dodgerblue",
          // flexBasis: 100, // flex Basis can be mapped to width or height depending on the main axis
          // flexGrow: 1, // grow to fit the empty space, same effect if use flex: 1,
          // flexShrink: 1, // this view can be shrink down when other views got pushed outside the screen
          // However, flexgrow and flexshrink can be replaced with flex. Therefore, they are not commonly used
          height: 100,
          width: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "gold",
          height: 100,
          width: 100,
          right: 20,
          bottom: 20,
          position: "relative", // "absolute" bring the view to the position indicated relatively with the screen
          // while "relative" will bring the view to the indicated position relatively with its former position
        }}
      />
      <View
        style={{
          backgroundColor: "tomato",
          height: 100,
          width: 100,
        }}
      />
      {/* <View
        style={{
          backgroundColor: "grey",
          height: 100,
          width: 100,
        }}
      />
      <View
        style={{
          backgroundColor: "green",
          height: 100,
          width: 100,
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // justifyContent: "center",
    // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
