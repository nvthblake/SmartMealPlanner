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
  Dimensions,
  Modal,
  TouchableHighlight,
  ScrollView,
  ImageBackground,
} from "react-native";
import CardView from "../components/CardView";
import AppText from "../components/AppText";
import CircularOverview from "../components/CircularOverview";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import ProgressBarAnimated from "react-native-progress-bar-animated";
import Screen from "../components/Screen";
// Database imports
import { openDatabase } from "expo-sqlite";

const db = openDatabase("db2.db");

function Profile(state) {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
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

    handleUpdateUserImage(pickerResult.uri);
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

    handleUpdateUserImage(pickerResult.uri);
  };

  // Progress bar logic
  const barWidth = screenWidth * 0.66;
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
    if (dateDiff <= 3 && dateDiff >= 1) {
      Expirein3 += 1;
    } else if (dateDiff > 3) {
      Expirein10 += 1;
    } else if (dateDiff <= 0) {
      Expired += 1;
    }
  });
  let fridgePct = Item < Limit ? Math.floor((Item / Limit) * 100) : 100;

  // Model State
  const [modalVisible, setModalVisible] = useState(false);

  const handleUpdateUserImage = (imagePath) => {
    setSelectedImage({ localUri: imagePath });
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE UserProfile \
        SET userProfileImageUri = ? \
        WHERE id = 0;`,
        [imagePath],
        [],
        (_, error) =>
            console.log("ProfileTab handleUpdateUserImage SQLite -> ", error)
      )
    })
  }

  const getInitUserImage = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `SELECT userProfileImageUri FROM UserProfile WHERE id = 0;`,
        [],
        (_, { rows }) => {
          setSelectedImage({ localUri: rows._array[0].userProfileImageUri });
        },  
        (_, error) => console.log("ProfileTab getInitUserImage SQLite -> ", error),
      )
    })
  }

  useEffect(getInitUserImage, []);

  return (
    <Screen style={styles.screen} headerTitle="Welcome to SmartFridge">
      <View
        style={{
          marginLeft: screenWidth * 0.02,
          marginRight: screenWidth * 0.02,
          paddingBottom: 50,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.imageView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Image
                source={{ uri: selectedImage.localUri }}
                style={styles.logo}
              />
            </TouchableOpacity>
          </View>
          <CardView>
            <Text style={{marginTop: screenHeight*0.005, marginLeft: screenWidth*0.02, fontSize: screenHeight*0.04, fontWeight: "bold", color: colors.grey}}>Your Fridge</Text>
            <View style={{marginTop: screenHeight*0.015, marginLeft: screenWidth*0.02, flexDirection: "row"}}>
              <Image
                source={require("../assets/appIcon/fridge2.png")}
                style={{height: screenWidth*0.05, width: screenWidth*0.05}}
              />
              <View style={[{marginLeft: screenWidth*0.03}, styles.fridgestatus]}>
                <ProgressBarAnimated
                  width={barWidth}
                  height={screenWidth*0.05}
                  backgroundColor={colors.primary}
                  value={fridgePct}
                />
              </View>
            </View>
            <Text style={{marginTop: screenHeight*0.015, marginLeft: screenWidth*0.02, fontSize: screenHeight*0.02}}>
              Your fridge is {fridgePct}% full
            </Text>
            <Text style={{marginTop: screenHeight*0.005, marginLeft: screenWidth*0.02, fontSize: screenHeight*0.02}}>
              Need to go shopping in the next 10 days
            </Text>
            <View style={[{marginTop: screenHeight*0.015, marginHorizontal: screenWidth*0.02}, styles.seperatorline]} />
            <View
              style={{
                marginTop: screenHeight*0.02,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
              }}
            >
              <CircularOverview
                stat={Expirein3}
                title={"Items expiring"}
                title2={"in 3 days"}
                size={Math.floor(screenWidth*0.2)}
                fontSize={screenWidth*0.1}
                fontColor={colors.grey}
              />
              <CircularOverview
                stat={Expirein10}
                title={"Items expiring"}
                title2={"in 10 days"}
                size={Math.floor(screenWidth*0.2)}
                fontSize={screenWidth*0.1}
                fontColor={colors.grey}
              />
              <CircularOverview
                stat={Expired}
                title={"Items already"}
                title2={"expired"}
                size={Math.floor(screenWidth*0.2)}
                fontSize={screenWidth*0.1}
                fontColor={colors.grey}
              />
            </View>
          </CardView>
          <Text style={[{marginLeft: screenWidth*0.06, fontSize: screenWidth*0.06}, styles.suggestHeader]}>Suggested Meals</Text>
          <CardView>
            <Text style={styles.suggestHeader}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua aliquip
              ex ea commodo consequat.{" "}
            </Text>
          </CardView>
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
            >
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
                    <Text style={styles.textStyle}>
                      SELECT PHOTO FROM GALERY
                    </Text>
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
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  suggestHeader: {
    // marginLeft: 20,
    // fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
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
    // marginTop: 0,
    marginBottom: 10,
  },
  minilogo: {
    // height: 80,
    // width: 80,
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
    // marginTop: 10,
    // marginLeft: 20,
    // fontSize: 10,
  },
  fridgeview: {
    // marginTop: screenWidth*0.02,
    // marginLeft: 20,
    flexDirection: "row",
  },
  fridgelogo: {
    height: 30,
    width: 30,
  },
  fridgestatus: {
    // marginLeft: 20,
    // marginTop: 10,
    alignItems: "center",
  },
  seperatorline: {
    // margin: 20,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  minilogoview: {
    flexDirection: "row",
    // margin: 20,
    justifyContent: "space-between",
  },
  minitext: {
    // marginTop: 5,
    textAlign: "center",
    // fontSize: 10,
  },
  viewDemotext: {
    justifyContent: "center",
    alignItems: "center",
  },
  demotext: {
    // fontSize: 35,
    color: colors.grey,
    // fontWeight: "bold",
  },
  screen: {
    paddingTop: 20,
    backgroundColor: colors.light,
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
