import React from "react";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";

import Constants from "expo-constants";
import colors from "../config/colors";

function Screen({ children, style, headerTitle }) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>
        {headerTitle && 
          <Text style={styles.title}>
            {headerTitle}
          </Text>}
        {children}
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: colors.background,
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    // fontStyle: 'Avenir',
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 28,
    color: colors.primary,
    marginBottom: 10
  }
});

export default Screen;
