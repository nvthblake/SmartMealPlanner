import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import CardView from "../shared/CardView";

function Profile(props) {
  return (
    <View>
      <View style={styles.imageView}>
        <Text style={styles.welcome}> Welcome to SmartFridge</Text>
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
          <Image
            source={require("../assets/appIcon/fridge-status.png")}
            style={styles.fridgestatus}
          />
        </View>
        <Text style={styles.fridgetext}>Your fridge is 0% full</Text>
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
    fontSize: 25,
    fontWeight: "bold",
    padding: 20,
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
    marginTop: -20,
    alignItems: "center",
  },
  seperatorline: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
  minilogoview: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    justifyContent: "space-between",
  },
  minitext: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
  },
});
export default Profile;
