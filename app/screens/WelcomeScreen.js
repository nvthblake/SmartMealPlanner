import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

function WelcomeScreen(props) {
  return (
    <ImageBackground
      style={styles.background}
      source={
        {
          uri: "https://picsum.photos/200/300",
        }
        //   require("../assets/sample.jpg")
      }
    >
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo-red.png")} />
        <Text style={styles.tagLine}>Smart Meal Planner</Text>
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="Login"
          onPress={() => console.log("login button tapped")}
        ></AppButton>
        <AppButton
          title="Signup"
          onPress={() => console.log("signup button tapped")}
          color="secondary"
        ></AppButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagLine: {
    fontSize: 25,
    fontWeight: "bold",
    color: colors.secondary,
    textTransform: "capitalize",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default WelcomeScreen;
