import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
  Image,
  Modal,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Camera, requestPermissionsAsync } from "expo-camera";
import * as Permissions from "expo-permissions";
// import Screen from "./Screen";
import { ref } from "yup";
import AppButton from "../../components/AppButton";
import colors from "../../config/colors";
// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addIngredientToScan, clearIngredientsToScan, deleteIngredientToScan } from "../../../actions";
import {  } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import * as ImagePicker from "expo-image-picker";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function CameraPage(state, { navigation }) {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [camVisibility, setCamVisibility] = useState(false);
  const showCameraView = () => {
    setCamVisibility(true);
  };
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const { ingredients, addIngredientToScan, clearIngredientsToScan, deleteIngredientToScan } = state;
  const ingredientToScan = ingredients.ingredientToScan;

  useEffect(() => {
    requestPermission();
  }, []);

  // Asking permission to use the camera
  const requestPermission = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the Camera.");
  };

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const cameraRef = useRef();

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
      const source = data.uri;
      if (source) {
        // await cameraRef.current.pausePreview();
        // setIsPreview(true);
        // console.log("picture source: ", source);
        addIngredientToScan({
          imageUri: source,
        });
        // console.log("IMAGE URI -> ", ingredientToScan);
      }
    }
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

    addIngredientToScan({ imageUri: pickerResult.uri });
  };

  const handleQuickExit = () => {
    Alert.alert(
      "Exit Scan?",
      "Are you sure you want to exit this page and lose all photos taken?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            clearIngredientsToScan();
            setModalVisible(false);
          }
        }
      ]
    )
  }

  return (
    <>
      <AppButton
        title={"SCAN FOOD"}
        // onPress={() => navigation.navigate("Camera")}
        onPress={() => setModalVisible(true)}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View
          style={{ height: 50, width: screenWidth, alignItems: "center", flexDirection: "row" }}
        >
          <TouchableWithoutFeedback onPress = {handleQuickExit}>
            <MaterialCommunityIcons name="close" size={35} color={colors.primary} />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{ height: screenWidth, width: "100%", justifyContent: "center" }}
        >
          <Camera
            style={{ flex: 1 }}
            type={type}
            ref={cameraRef}
            onCameraReady={onCameraReady}
            ratio={"1:1"}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: "flex-end",
                  alignItems: "center",
                }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="camera-retake"
                  size={30}
                  color="white"
                />
                {/* <Text style={{ fontSize: 18, color: "white" }}>Flip</Text> */}
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
        <View
          style={{
            alignItems: "center",
            //   backgroundColor: colors.lightGrey,
            //   justifyContent: "space-between",
            flexDirection: "column",
            height: screenHeight - screenWidth - 130,
          }}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              data={ingredientToScan}
              horizontal
              showsHorizontalScrollIndicator={true}
              keyExtractor={(ingreImage) => ingreImage.imageUri}
              renderItem={({ item, index }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={(ingredientToScan) =>
                      deleteIngredientToScan(item.imageUri)
                    }
                  >
                    <Image
                      style={{
                        height: screenWidth / 4,
                        width: screenWidth / 4,
                        marginVertical: 5,
                        marginHorizontal: 1,
                      }}
                      source={{ uri: ingredientToScan[index].imageUri }}
                    />
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </View>
          <View
            style={{
              flex: 1.5,
              // marginTop: 10,
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
              onPress={openImagePickerAsync}
            >
              <MaterialCommunityIcons
                name="folder-image"
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
                //   marginBottom: 30,
              }}
              onPress={takePicture}
              onLongPress={() => navigation.navigate("ScanTab")}
            />
            <TouchableOpacity
              style={{
                padding: 10,
                //   width: 50,
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                //   backgroundColor: colors.primary,
                marginBottom: 10,
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <MaterialCommunityIcons
                name="content-save-all-outline"
                size={35}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              backgroundColor: colors.white,
              borderColor: colors.primary,
              borderWidth: 10,
              marginBottom: 30,
            }}
            onPress={takePicture}
            onLongPress={() => navigation.navigate("ScanTab")}
          /> */}
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addIngredientToScan,
      clearIngredientsToScan,
      deleteIngredientToScan,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage);
