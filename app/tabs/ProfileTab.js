import React, { useState, useRef, useEffect } from "react";
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
  Modal,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import CardView from "../components/CardView";
import AppText from "../components/AppText";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";

function Profile(state) {
  // Camera logic
  const [selectedImage, setSelectedImage] = useState("");
  const takePicture = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage({ localUri: pickerResult.uri });
  };

  // Progress bar logic
  const { ingredients, addIngredientToFridge } = state;
  const ingredientsInFridge = ingredients.fridge;
  const Limit = 100;
  let Item = 0;
  ingredientsInFridge.forEach((element) => {
    Item += parseInt(element.qty);
  });
  let Expirein3 = 0;
  let Expirein10 = 0;
  let Expired = 0;
  ingredientsInFridge.forEach((element) => {
    const today = new Date();
    const expDate = Date.parse(element.expDate);
    var dateDiff = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    if (dateDiff <= 3 && dateDiff > 1) {
      Expirein3 += 1;
    } else if (dateDiff > 3) {
      Expirein10 += 1;
    } else if (dateDiff <= 0) {
      Expired += 1;
    }
  });

  // Model State
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.imageView}>
        <AppText style={styles.welcome}>{"Welcome to SmartFridge"}</AppText>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Image source={{ uri: selectedImage.localUri }} style={styles.logo} />
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
            progress={Item / Limit}
          />
        </View>
        <Text style={styles.fridgetext}>
          Your fridge is {(Item / Limit) * 100}% full
        </Text>
        <Text style={styles.fridgetext}>
          Need to go shopping in the next 10 days
        </Text>
        <View style={styles.seperatorline} />
        <View style={styles.minilogoview}>
          <View>
            <Image
              source={require("../assets/appIcon/white.png")}
              style={styles.minilogo}
            />
            <View style={styles.viewDemotext}>
              <Text style={styles.demotext}>{Expirein3}</Text>
            </View>
            <Text style={styles.minitext}>Item is expiring</Text>
            <Text style={styles.minitext}>in 3 days</Text>
          </View>
          <View>
            <Image
              source={require("../assets/appIcon/white.png")}
              style={styles.minilogo}
            />
            <View style={styles.viewDemotext}>
              <Text style={styles.demotext}>{Expirein10}</Text>
            </View>
            <Text style={styles.minitext}>Item is expiring</Text>
            <Text style={styles.minitext}>in 10 days</Text>
          </View>
          <View>
            <Image
              source={require("../assets/appIcon/white.png")}
              style={styles.minilogo}
            />
            <View style={styles.viewDemotext}>
              <Text style={styles.demotext}>{Expired}</Text>
            </View>
            <Text style={styles.minitext}>Item is already</Text>
            <Text style={styles.minitext}>expired</Text>
          </View>
        </View>
      </CardView>
      <Text style={styles.suggestHeader}>Suggested Meals</Text>
      <CardView>
        <Text style={styles.suggestHeader}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua
          aliquip ex ea commodo consequat.{" "}
        </Text>
      </CardView>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={styles.takePhotoButton}
                onPress={() => {
                  takePicture();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>TAKE NEW PHOTO</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.selectPhotoButton}
                onPress={() => {
                  openImagePickerAsync();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>SELECT PHOTO FROM GALERY</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>CANCEL</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  suggestHeader: {
    marginLeft: 20,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  cancelButton: {
    backgroundColor: colors.font_red,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
    marginTop: 20,
  },
  selectPhotoButton: {
    backgroundColor: colors.black,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
    marginTop: 20,
  },
  takePhotoButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
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
    marginTop: 20,
    marginBottom: 20,
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
    marginTop: 20,
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
    width: "75%",
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
  viewDemotext: {
    marginTop: 13,
    marginLeft: 28,
    position: "absolute",
  },
  demotext: {
    fontSize: 35,
    color: colors.primary,
    fontWeight: "bold",
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
