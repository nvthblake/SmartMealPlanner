import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Text,
} from "react-native";
// import {  } from "react-native-gesture-handler";
import colors from "../config/colors";
import AppText from "./AppText";

function SqCard({
  title,
  subTitle1,
  subTitle2,
  image,
  expStatus,
  screenWidth,
  onPress,
  onLongPress,
}) {
  return (
    <TouchableWithoutFeedback onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.card,
          {
            height: (0.88 * screenWidth) / 3,
            width: (0.88 * screenWidth) / 3,
            marginBottom: 0.04 * screenWidth,
            // borderColor: expStatus,
          },
        ]}
      >
        {/* Ingredients Images */}
        <Image
          style={[
            styles.image,
            // { marginTop: ((0.85 * screenWidth) / 3) * 0.025 },
          ]}
          source={{ uri: image }}
        />
        <View style={styles.detailsContainer}>
          {/* Ingredients Title */}
          <AppText style={[styles.title, { fontSize: 0.035 * screenWidth }]}>
            {title}
          </AppText>

          <View style={{ flexDirection: 'row' }}>
            {/* Ingredients quantity */}
            <AppText style={[styles.subTitle, { fontSize: 0.025 * screenWidth }]}>
              {subTitle1}
            </AppText>
            <Text style={[styles.subTitle, { fontSize: 0.025 * screenWidth }]}> | </Text>
            {/* Ingredients exp days */}
            <AppText
              style={[
                styles.subTitle,
                { fontSize: 0.025 * screenWidth, color: expStatus },
              ]}
            >
              {subTitle2}
            </AppText>
          </View>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    // justifyContent: "center",

    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  detailsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 3,
    width: "95%",
    height: "65%",
    borderRadius: 15,
    borderColor: colors.white,
    overflow: "hidden",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    color: colors.grey,
    fontWeight: "bold",
  },
  subTitle: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: colors.primary,
    color: colors.grey,
  },
});
export default SqCard;
