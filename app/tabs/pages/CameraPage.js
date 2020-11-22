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
import {
  addIngredientToScan,
  clearIngredientsToScan,
  deleteIngredientToScan,
} from "../../../actions";
import { } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Screen from "../../components/Screen";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../components/CustomButton";
import CamButton from "../../components/CamButton";

// Tensorflow
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

// Screen dim
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

// Main
function CameraPage(state, { navigation }) {
  // Hook
  const [modalVisible, setModalVisible] = useState(false);
  const [camVisibility, setCamVisibility] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [predictionFound, setPredictionFound] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const showCameraView = () => { setCamVisibility(true); };

  // Redux
  const {
    ingredients,
    addIngredientToScan,
    clearIngredientsToScan,
    deleteIngredientToScan,
  } = state;
  const ingredientToScan = ingredients.ingredientToScan;

  // Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);

  // TF Camera Decorator
  const TensorCamera = cameraWithTensors(Camera);

  //RAF ID
  let requestAnimationFrameId = 0;

  //performance hacks (Platform dependent)
  const textureDims =
    Platform.OS === "ios"
      ? { width: 1080, height: 1920 }
      : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 };

  // 1. Check camera permissions
  // 2. Initialize TensorFlow
  // 3. Load Mobilenet Model
  useEffect(() => {
    if (!frameworkReady) {
      (async () => {
        //check permissions
        requestPermission();

        //we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready();

        //load the mobilenet model and save it in state
        setMobilenetModel(await loadMobileNetModel());

        setFrameworkReady(true);
      })();
    }
  }, []);

  // Run onUnmount routine for cancelling animation if running to avoid leaks
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  // Loads the mobilenet Tensorflow model:
  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  };

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
    console.log("---takePicture");
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

  const openImagePickerAsync = async () => {
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
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            clearIngredientsToScan();
            setModalVisible(false);
          },
        },
      ]
    );
  };

  // get Prediction from tensor
  const getPrediction = async (tensor) => {
    if (!tensor) { return; }

    // topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1);

    // if (!prediction || prediction.length === 0) { return; }

    // only display to screen if probability is higher than 20%
    if (prediction[0].probability > 0.3) {
      console.log(`prediction: ${JSON.stringify(prediction)}`);

      // stop looping!
      // cancelAnimationFrame(requestAnimationFrameId);
      // setPredictionFound(true);
    }
  };

  // Tensorflow JS
  const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      const nextImageTensor = await imageAsTensors.next().value;
      await getPrediction(nextImageTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if (!predictionFound) loop();
  };

  return (
    <>
      <CamButton
        height={50}
        icon={"camera"}
        title={"SCAN FOOD"}
        onPress={() => setModalVisible(true)}
      />
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View
          style={{
            height: 50,
            width: screenWidth,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <TouchableWithoutFeedback onPress={handleQuickExit}>
            <MaterialCommunityIcons
              name="close"
              size={35}
              color={colors.primary}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: screenWidth,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TensorCamera
            style={{ flex: 1 }}
            type={type}
            // ref={cameraRef}
            ratio={"1:1"}
            zoom={0}
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={tensorDims.height}
            resizeWidth={tensorDims.width}
            resizeDepth={3}
            onCameraReady={onCameraReady}
            onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
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
          </TensorCamera>
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
