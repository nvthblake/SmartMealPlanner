import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { Camera, requestPermissionsAsync } from "expo-camera";
import * as Permissions from "expo-permissions";
// import Screen from "./Screen";
import { ref } from "yup";
// import AppButton from "./AppButton";
import colors from "../../config/colors";
// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { addIngredientToScan } from "../../../actions";

function CameraPage(state, { navigation }) {
  const [camVisibility, setCamVisibility] = useState(false);
  const showCameraView = () => {
    setCamVisibility(true);
  };
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const { ingredients , addIngredientToScan } = state;
  const ingredientToScan = ingredients.ingredientToScan;

  useEffect(() => {
    requestPermission();
  }, []);

  // Asking permission to use the camera
  const requestPermission = async () => {
    const { granted } = await Camera.requestPermissionsAsync();
    if (!granted) alert("You need to enable permission to access the Camera.");
  };

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestPermissionsAsync();
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);
  //   if (hasPermission === null) {
  //     return <View />;
  //   }
  //   if (hasPermission === false) {
  //     return <Text>No access to camera</Text>;
  //   }
  //   const { isCameraVisible } = camVisibility;

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
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        console.log("picture source: ", source);
        addIngredientToScan({
          imageUri: source
        });
        console.log("IMAGE URI -> ", ingredientToScan);
      }
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Camera
        style={{ flex: 1 }}
        type={type}
        ref={cameraRef}
        onCameraReady={onCameraReady}
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
        <View style={{ alignItems: "center" }}>
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
      </Camera>
    </View>
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
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage);
