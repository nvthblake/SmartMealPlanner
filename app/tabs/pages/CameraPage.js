import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
} from "react-native";
import { Camera, requestPermissionsAsync } from "expo-camera";
import * as Permissions from "expo-permissions";
// import Screen from "./Screen";
import { ref } from "yup";
// import AppButton from "./AppButton";
import colors from "../../config/colors";

const screenWidth = Dimensions.get("window").width;

function CameraPage({ navigation }) {
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
              justifyContent: "space-between",
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
          flexDirection: "row",
        }}
      >
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

export default CameraPage;
