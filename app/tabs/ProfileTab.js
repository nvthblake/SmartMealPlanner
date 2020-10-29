import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addIngredientToFridge } from "../../actions";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ProgressBarAndroid,
} from "react-native";
import CardView from "../components/CardView";
import AppText from "../components/AppText";
import colors from "../config/colors";

function Profile(state) {
  const { ingredients, addIngredientToFridge } = state;
  const ingredientsInFridge = ingredients.fridge;
  const Limit = 100;
  let Item = 0;
  ingredientsInFridge.forEach(element => {
    Item += parseInt(element.qty);
  });
  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <AppText style={styles.welcome}>{"Welcome to SmartFridge"}</AppText>
        <TouchableOpacity>
          <Image
            source={require("../assets/appIcon/ava.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
      </View>
      <CardView>
        <Text style={styles.fridgeheader}>Your Fridge</Text>
        <View style={styles.fridgeview}>
          <Image
            source={require("../assets/appIcon/fridge2.png")}
            style={styles.fridgelogo}
          />
          <ProgressBarAndroid
            style={styles.fridgestatus}
            color={colors.primary}
            styleAttr="Horizontal"
            indeterminate={false}
            progress={Item/Limit}
          />
        </View>
        <Text style={styles.fridgetext}>Your fridge is {(Item/Limit)*100}% full</Text>
        <Text style={styles.fridgetext}>
          Need to go shopping in the next 10 days
        </Text>
        <View style={styles.seperatorline} />
        <View style={styles.minilogoview}>
          <View>
            <Image
              source={require("../assets/appIcon/ava.png")}
              style={styles.minilogo}
            />
            <Text style={styles.minitext}>Item is expiring</Text>
            <Text style={styles.minitext}>in 3 days</Text>
          </View>
          <View>
            <Image
              source={require("../assets/appIcon/ava.png")}
              style={styles.minilogo}
            />
            <Text style={styles.minitext}>Item is expiring</Text>
            <Text style={styles.minitext}>in 10 days</Text>
          </View>
          <View>
            <Image
              source={require("../assets/appIcon/ava.png")}
              style={styles.minilogo}
            />
            <Text style={styles.minitext}>Item is already</Text>
            <Text style={styles.minitext}>expired</Text>
          </View>
        </View>
      </CardView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  logo: {
    height: 140,
    width: 140,
    borderRadius: 100,
    borderColor: "#537aff",
    overflow: "hidden",
    borderWidth: 2,
    marginTop: 30,
    marginBottom: 30,
  },
  minilogo: {
    height: 80,
    width: 80,
    borderRadius: 100,
    borderColor: "#537aff",
    overflow: "hidden",
    borderWidth: 2,
  },
  imageView: {
    alignItems: "center",
  },
  welcome: {
    marginTop: 70,
    fontSize: 30,
    fontWeight: "bold",
    padding: 20,
    color: colors.primary,
  },
  fridgeheader: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 12,
    fontWeight: "bold",
  },
  fridgetext: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 10,
  },
  fridgeview: {
    marginTop: 20,
    marginLeft: 20,
    flexDirection: "row",
  },
  fridgelogo: {
    height: 40,
    width: 40,
  },
  fridgestatus: {
    height: 60,
    width: "80%",
    marginLeft: 30,
    marginTop: -10,
    alignItems: "center",
  },
  seperatorline: {
    margin: 20,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  },
  minilogoview: {
    flexDirection: "row",
    margin: 20,
    justifyContent: "space-between",
  },
  minitext: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
  },
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addIngredientToFridge,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
