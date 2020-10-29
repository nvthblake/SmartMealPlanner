import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { Camera, requestPermissionsAsync } from "expo-camera";
import * as Permissions from "expo-permissions";
import Screen from "./Screen";
import { colors } from "react-native-elements";
import { ref } from "yup";
import AppButton from "./AppButton";

function CameraButton(props) {
  const [camVisibility, setCamVisibility] = useState(false);
  const showCameraView = () => {
    setCamVisibility(true);
  };
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

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

  // const onCameraReady = () => {
  //   setIsCameraReady(true);
  // };

  // const cameraRef = useRef();

  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     const options = { quality: 0.5, base64: true, skipProcessing: true };
  //     const data = await cameraRef.current.takePictureAsync(options);
  //     const source = data.uri;
  //     if (source) {
  //       await cameraRef.current.pausePreview();
  //       setIsPreview(true);
  //       console.log("picture source: ", source);
  //     }
  //   }
  // };

  return (
    <Screen style={{ flex: 1, justifyContent: "center" }}>
      <View>
        <AppButton title="Show me Camera" onPress={showCameraView} />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default CameraButton;
