import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  SafeAreaView,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Alert,
  Platform,
  StatusBar,
} from "react-native";

export default function App() {
  const handlePress = () => console.log("text pressed");
  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <Text numberOfLines={1} onPress={handlePress}>
        It is a beautiful world!
      </Text>
      <TouchableNativeFeedback onPress={() => console.log("image pressed")}>
        <View
          style={{ width: 200, height: 70, backgroundColor: "dodgerblue" }}
        ></View>
      </TouchableNativeFeedback>
      <Image
        blurRadius={1}
        fadeDuration={1000}
        source={{
          width: 200,
          height: 300,
          uri: "https://picsum.photos/200/300",
        }}
      />
      <Button
        title="Click me"
        onPress={() =>
          Alert.alert("Warning", "Button just clicked", [
            { text: "Yes", onPress: () => console.log("yes") },
            { text: "No", onPress: () => console.log("no") },
          ])
        }
        color="orange"
      />
      {/* <StatusBar style="auto" /> */}
    </SafeAreaView>
  );
}

const containerStyle = { backgroundColor: "orange" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    // justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
