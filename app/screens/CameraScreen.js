import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import Screen from "../components/Screen";
import { colors } from "react-native-elements";
import { ref } from "yup";

function CameraScreen(props) {
  const [camVisibility, setCamVisibility] = useState(false);
  const showCameraView = () => {
    setCamVisibility(true);
  };
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

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
        console.log("picture source", source);
      }
    }
  };

  return (
    <Screen style={{ flex: 1, justifyContent: "center" }}>
      <View>
        {!camVisibility && (
          <Button title="Show me Camera" onPress={showCameraView} />
        )}
      </View>
      {camVisibility && (
        <Camera
          style={{ flex: 0.5 }}
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
                setCamVisibility(false);
              }}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
                {" "}
                Stop{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>
      )}
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <TouchableOpacity
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            backgroundColor: colors.white,
            borderColor: colors.primary,
            borderWidth: 5,
          }}
          onPress={takePicture}
          onLongPress={() => {
            setCamVisibility(false);
          }}
        />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default CameraScreen;
