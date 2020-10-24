import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import {openDatabase} from 'expo-sqlite';

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";


const db = openDatabase("db2.db");

const validationSchema = Yup.object().shape({
  ingredient: Yup.string().required().min(1).label("Ingredient"),
  qty: Yup.number().required().min(1).max(10000).label("Quantity"),
  unit: Yup.object().required().nullable().label("Unit"),
  category: Yup.object().required().nullable().label("Category"),
  dayToExp: Yup.number().required().min(1).label("Days to Expiration"),
  images: Yup.array().min(1, "Please select at least 1 image."),
});

const categories = [
  { label: "Meat", value: 1, backgroundColor: "red", icon: "apps" },
  { label: "Vegetable", value: 2, backgroundColor: "green", icon: "email" },
  { label: "Condiments", value: 3, backgroundColor: "blue", icon: "lock" },
  { label: "Snack", value: 4, backgroundColor: "blue", icon: "lock" },
  { label: "Fruit", value: 5, backgroundColor: "blue", icon: "lock" },
  { label: "Others", value: 6, backgroundColor: "blue", icon: "lock" },
];

const units = [
  { label: "Quartz", value: 1},
  { label: "Kg", value: 2}
]

function ScanTab() {

  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    var expDate = new Date(new Date().getTime()+(values.dayToExp*24*60*60*1000)).toISOString();
    // Insert new ingredient to SQLite database
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO FactFridge (ingredient, qty, unit, category, dayToExp, inFridge, expDate) values (?, ?, ?, ?, ?, ?, ?)", 
        [values.ingredient, values.qty, values.unit.label, values.category.label, values.dayToExp, 1, expDate],
        setSuccess(true), 
        (_, error) => {
          setSuccess(false);
          console.log(error);
        }
      );
    },
    null,
    forceUpdate);
    if (success) {
      resetForm();
      setSuccess(false);
    }
  }

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          ingredient: "",
          qty: "",
          unit: null,
          category: null,
          dayToExp: "",
          images: [],
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <AppFormField 
          name="ingredient" 
          placeholder="Ingredient" 
        />
        <AppFormField
          name="qty"
          placeholder="Quantity"
          keyboardType="numeric"
        />
        <AppFormPicker
          items={units}
          name="unit"
          placeholder="Unit"
        />
        <AppFormPicker
          items={categories}
          name="category"
          placeholder="Category"
        />
        <AppFormField
          name="dayToExp"
          placeholder="Days to Expiration"
          keyboardType="numeric"
        />
        <SubmitButton title="Post" />
      </AppForm>
    </Screen>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ScanTab;

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