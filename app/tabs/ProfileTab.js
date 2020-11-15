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
} from "react-native";
import CardView from "../components/CardView";
import AppText from "../components/AppText";
import colors from "../config/colors";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function Profile(state) {
  // Camera logic
  const [selectedImage, setSelectedImage] = useState("");
  const cameraRef = useRef();
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
    }
    else {
      console.log("Hello", cameraRef.current)
    }
  }

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

  // Model State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

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
              <Text style={styles.demotext}>{ingredientsInFridge.length}</Text>
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
              <Text style={styles.demotext}>{ingredientsInFridge.length}</Text>
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
              <Text style={styles.demotext}>{ingredientsInFridge.length}</Text>
            </View>
            <Text style={styles.minitext}>Item is already</Text>
            <Text style={styles.minitext}>expired</Text>
          </View>
        </View>
      </CardView>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={styles.takePhotoButton}
                onPress={() => {
                  setModalVisible1(!modalVisible1);
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
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible1}
        >
          <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Camera style={styles.camera}>
            </Camera>
            <View
              style={{
                flex: 1.5,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
                onPress={() => setModalVisible1(!modalVisible1)}
              >
                <MaterialCommunityIcons
                  name="arrow-left-bold-circle"
                  size={35}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                  backgroundColor: colors.white,
                  borderColor: colors.primary,
                  borderWidth: 10,
                }}
                onPress={() => {
                  takePicture();
                  setModalVisible1(!modalVisible1);
                }}
              />
              <TouchableOpacity
                style={{
                  padding: 10,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              ></TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  camera: {
    height: "80%",
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
