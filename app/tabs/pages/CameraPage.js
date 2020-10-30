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
} from "react-native";
import { Camera, requestPermissionsAsync } from "expo-camera";
import * as Permissions from "expo-permissions";
// import Screen from "./Screen";
import { ref } from "yup";
// import AppButton from "./AppButton";
import colors from "../../config/colors";
// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addIngredientToScan, deleteIngredientToScan } from "../../../actions";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

function CameraPage(state, { navigation }) {
  const [camVisibility, setCamVisibility] = useState(false);
  const showCameraView = () => {
    setCamVisibility(true);
  };
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const { ingredients, addIngredientToScan, deleteIngredientToScan } = state;
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
        console.log("picture source: ", source);
        addIngredientToScan({
          imageUri: source,
        });
        console.log("IMAGE URI -> ", ingredientToScan);
      }
    }
  };

  return (
    <>
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
              backgroundColor: "transparent",
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
              <Text style={{ fontSize: 18, color: "white" }}>Flip</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <FlatList
          data={ingredientToScan}
          horizontal
          showsHorizontalScrollIndicator={false}
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
                    height: 100,
                    width: 100,
                    marginVertical: 5,
                    marginHorizontal: 1,
                  }}
                  source={{ uri: ingredientToScan[index].imageUri }}
                />
              </TouchableWithoutFeedback>
            );
          }}
        />
        <TouchableOpacity
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
        />
      </View>
    </>
  );
}
{
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
      deleteIngredientToScan,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage);
