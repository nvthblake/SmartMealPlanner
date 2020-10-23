// import React, { useState } from "react";
// import { StyleSheet } from "react-native";
// import * as Yup from "yup";
// import {openDatabase} from 'expo-sqlite';

// import {
//   AppForm,
//   AppFormField,
//   AppFormPicker,
//   SubmitButton,
// } from "../components/forms";
// import Screen from "../components/Screen";
// import CategoryPickerItem from "../components/CategoryPickerItem";
// import FormImagePicker from "../components/forms/FormImagePicker";


// const db = openDatabase("db2.db");

// const validationSchema = Yup.object().shape({
//   ingredient: Yup.string().required().min(1).label("Ingredient"),
//   qty: Yup.number().required().min(1).max(10000).label("Quantity"),
//   unit: Yup.object().required().nullable().label("Unit"),
//   category: Yup.object().required().nullable().label("Category"),
//   dayToExp: Yup.number().required().min(1).label("Days to Expiration"),
//   images: Yup.array().min(1, "Please select at least 1 image."),
// });

// const categories = [
//   { label: "Meat", value: 1, backgroundColor: "red", icon: "apps" },
//   { label: "Vegetable", value: 2, backgroundColor: "green", icon: "email" },
//   { label: "Condiments", value: 3, backgroundColor: "blue", icon: "lock" },
//   { label: "Snack", value: 4, backgroundColor: "blue", icon: "lock" },
//   { label: "Fruit", value: 5, backgroundColor: "blue", icon: "lock" },
//   { label: "Others", value: 6, backgroundColor: "blue", icon: "lock" },
// ];

// const units = [
//   { label: "Quartz", value: 1},
//   { label: "Kg", value: 2}
// ]

// function ScanTab() {

//   const [forceUpdate, forceUpdateId] = useForceUpdate();
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (values, { resetForm }) => {
//     var expDate = new Date(new Date().getTime()+(values.dayToExp*24*60*60*1000)).toISOString();
//     // Insert new ingredient to SQLite database
//     db.transaction(tx => {
//       tx.executeSql(
//         "INSERT INTO FactFridge (ingredient, qty, unit, category, dayToExp, inFridge, expDate) values (?, ?, ?, ?, ?, ?, ?)", 
//         [values.ingredient, values.qty, values.unit.label, values.category.label, values.dayToExp, 1, expDate],
//         setSuccess(true), 
//         (_, error) => {
//           setSuccess(false);
//           console.log(error);
//         }
//       );
//     },
//     null,
//     forceUpdate);
//     if (success) {
//       resetForm();
//       setSuccess(false);
//     }
//   }

//   return (
//     <Screen style={styles.container}>
//       <AppForm
//         initialValues={{
//           ingredient: "",
//           qty: "",
//           unit: null,
//           category: null,
//           dayToExp: "",
//           images: [],
//         }}
//         onSubmit={handleSubmit}
//         validationSchema={validationSchema}
//       >
//         <FormImagePicker name="images" />
//         <AppFormField 
//           name="ingredient" 
//           placeholder="Ingredient" 
//         />
//         <AppFormField
//           name="qty"
//           placeholder="Quantity"
//           keyboardType="numeric"
//         />
//         <AppFormPicker
//           items={units}
//           name="unit"
//           placeholder="Unit"
//         />
//         <AppFormPicker
//           items={categories}
//           name="category"
//           placeholder="Category"
//         />
//         <AppFormField
//           name="dayToExp"
//           placeholder="Days to Expiration"
//           keyboardType="numeric"
//         />
//         <SubmitButton title="Post" />
//       </AppForm>
//     </Screen>
//   );
// }

// function useForceUpdate() {
//   const [value, setValue] = useState(0);
//   return [() => setValue(value + 1), value];
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//   },
// });

// export default ScanTab;

// import React, { useState, useEffect, useRef } from "react";
// import { View, StyleSheet, TouchableOpacity, Text, Button } from "react-native";
// import { Camera } from "expo-camera";
// import * as Permissions from "expo-permissions";
// import Screen from "../components/Screen";
// import { colors } from "react-native-elements";
// import { ref } from "yup";

// function CameraScreen(props) {
//   const [camVisibility, setCamVisibility] = useState(false);
//   const showCameraView = () => {
//     setCamVisibility(true);
//   };
//   const [isCameraReady, setIsCameraReady] = useState(false);
//   const [isPreview, setIsPreview] = useState(false);
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   //   if (hasPermission === null) {
//   //     return <View />;
//   //   }
//   //   if (hasPermission === false) {
//   //     return <Text>No access to camera</Text>;
//   //   }
//   //   const { isCameraVisible } = camVisibility;

//   const onCameraReady = () => {
//     setIsCameraReady(true);
//   };

//   const cameraRef = useRef();

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const options = { quality: 0.5, base64: true, skipProcessing: true };
//       const data = await cameraRef.current.takePictureAsync(options);
//       const source = data.uri;
//       if (source) {
//         await cameraRef.current.pausePreview();
//         setIsPreview(true);
//         console.log("picture source", source);
//       }
//     }
//   };

//   return (
//     <Screen style={{ flex: 1, justifyContent: "center" }}>
//       <View>
//         {!camVisibility && (
//           <Button title="Show me Camera" onPress={showCameraView} />
//         )}
//       </View>
//       {camVisibility && (
//         <Camera
//           style={{ flex: 0.5 }}
//           type={type}
//           ref={cameraRef}
//           onCameraReady={onCameraReady}
//         >
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "transparent",
//               flexDirection: "row",
//             }}
//           >
//             <TouchableOpacity
//               style={{
//                 flex: 0.1,
//                 alignSelf: "flex-end",
//                 alignItems: "center",
//               }}
//               onPress={() => {
//                 setCamVisibility(false);
//               }}
//             >
//               <Text style={{ fontSize: 18, marginBottom: 10, color: "white" }}>
//                 {" "}
//                 Stop{" "}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </Camera>
//       )}
//       <View style={{ alignItems: "center", marginTop: 30 }}>
//         <TouchableOpacity
//           style={{
//             height: 80,
//             width: 80,
//             borderRadius: 40,
//             backgroundColor: colors.white,
//             borderColor: colors.primary,
//             borderWidth: 5,
//           }}
//           onPress={takePicture}
//           onLongPress={() => {
//             setCamVisibility(false);
//           }}
//         />
//       </View>
//     </Screen>
//   );
// }
// const styles = StyleSheet.create({
//   container: {},
// });

import React, { useState, useEffect } from 'react';

//react native
import { ActivityIndicator, Text, View, ScrollView, StyleSheet, Button, Platform } from 'react-native';

//picker
import RNPickerSelect from 'react-native-picker-select';
import { Chevron } from 'react-native-shapes';

//Expo
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';

//Tensorflow
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

//disable yellow warnings on EXPO client!
console.disableYellowBox = true;

function ScanTab() {

  //------------------------------------------------
  //state variables for image/translation processing
  //------------------------------------------------
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [language, setLanguage] = useState('he');
  const [translationAvailable, setTranslationAvailable] = useState(true);
  const [predictionFound, setPredictionFound] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  //Tensorflow and Permissions
  const [mobilenetModel, setMobilenetModel] = useState(null);
  const [frameworkReady, setFrameworkReady] = useState(false);

  //TF Camera Decorator
  const TensorCamera = cameraWithTensors(Camera);

  //RAF ID
  let requestAnimationFrameId = 0;

  //performance hacks (Platform dependent)
  const textureDims = Platform.OS === "ios" ? { width: 1080, height: 1920 } : { width: 1600, height: 1200 };
  const tensorDims = { width: 152, height: 200 };

  //-----------------------------
  // Run effect once
  // 1. Check camera permissions
  // 2. Initialize TensorFlow
  // 3. Load Mobilenet Model
  //-----------------------------
  useEffect(() => {
    if (!frameworkReady) {
      (async () => {

        //check permissions
        const { status } = await Camera.requestPermissionsAsync();
        console.log(`permissions status: ${status}`);
        setHasPermission(status === 'granted');

        //we must always wait for the Tensorflow API to be ready before any TF operation...
        await tf.ready();

        //load the mobilenet model and save it in state
        setMobilenetModel(await loadMobileNetModel());

        setFrameworkReady(true);
      })();
    }
  }, []);

  //--------------------------
  // Run onUnmount routine
  // for cancelling animation 
  // if running to avoid leaks
  //--------------------------
  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestAnimationFrameId);
    };
  }, [requestAnimationFrameId]);

  //--------------------------------------------------------------
  // Helper asynchronous function to invoke the Google Translation
  // API and fetch the translated text. Excellent documentation
  // for parameters and response data structure is here 
  // (Translating text (Basic)):
  // https://cloud.google.com/translate/docs/basic/quickstart
  //
  // NOTE: Here we are using the simple GET with key model. While
  // this is simple to implement, it is recommended to do a POST
  // with an OAuth key to avoid key tampering. This approach is
  // for instructional purposes ONLY.
  //---------------------------------------------------------------
  const getTranslation = async (className) => {
    try {
      const googleTranslateApiEndpoint = `${GoogleTranslateAPI}?q=${className}&target=${language}&format=html&source=en&model=nmt&key=${GoogleAPIKey}`;
      console.log(`Attempting to hit Google API Endpoint: ${googleTranslateApiEndpoint}`);

      const apiCall = await fetch(googleTranslateApiEndpoint);
      if (!apiCall) {
        console.error(`Google API did not respond adequately. Review API call.`);
        //throw new Error(`Google API did not respond.`);
        setTranslation(`Cannot get transaction at this time. Please try again later`);
      }

      //get JSON data
      let response = await apiCall.json();
      if (!response.data || !response.data.translations || response.data.translations.length === 0) {
        console.error(`Google API unexpected response. ${response}`);
        //throw new Error(`Google API responded with invalid data.`);
        setTranslation(`Cannot get transaction at this time. Please try again later`);
      }

      // we only care about the first occurrence
      console.log(`Translated text is: ${response.data.translations[0].translatedText}`);
      setTranslation(response.data.translations[0].translatedText);
      setWord(className);
    } catch (error) {
      console.error(`Error while attempting to get translation from Google API. Error: ${error}`);
      setTranslation(`Cannot get transaction at this time. Please try again later`);
    }

    setTranslationAvailable(true);
  }

  //-----------------------------------------------------------------
  // Loads the mobilenet Tensorflow model: 
  // https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
  // Parameters:
  // 
  // NOTE: Here, I suggest you play with the version and alpha params
  // as they control performance and accuracy for your app. For instance,
  // a lower alpha increases performance but decreases accuracy. More
  // information on this topic can be found in the link above.  In this
  // tutorial, I am going with the defaults: v1 and alpha 1.0
  //-----------------------------------------------------------------
  const loadMobileNetModel = async () => {
    const model = await mobilenet.load();
    return model;
  }

  //----------------------------------------------------------------------------------------
  // MobileNet tensorflow model classify operation returns an array of prediction objects 
  // with this structure: prediction = [ {"className": "object name", "probability": 0-1 } ]
  // where:
  // className = The class of the object being identified. Currently, this model identifies 1000 different classes.
  // probability = Number between 0 and 1 that represents the prediction's probability 
  // Example (with a topk parameter set to 3 => default):
  // [
  //   {"className":"joystick","probability":0.8070220947265625},
  //   {"className":"screen, CRT screen","probability":0.06108357384800911},
  //   {"className":"monitor","probability":0.04016926884651184}
  // ]
  // In this case, we use topk set to 1 as we are interested in the higest result for
  // both performance and simplicity. This means the array will return 1 prediction only!
  //----------------------------------------------------------------------------------------
  const getPrediction = async (tensor) => {
    if (!tensor) { return; }

    //topk set to 1
    const prediction = await mobilenetModel.classify(tensor, 1);
    console.log(`prediction: ${JSON.stringify(prediction)}`);

    if (!prediction || prediction.length === 0) { return; }

    //only attempt translation when confidence is higher than 20%
    if (prediction[0].probability > 0.1) {

      //stop looping!
      cancelAnimationFrame(requestAnimationFrameId);
      setPredictionFound(true);

      //get translation!
      // await getTranslation(prediction[0].className);
    }
  }

  //------------------------------------------------------------------------------
  // Helper function to handle the camera tensor streams. Here, to keep up reading
  // input streams, we use requestAnimationFrame JS method to keep looping for 
  // getting better predictions (until we get one with enough confidence level).
  // More info on RAF:
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  //------------------------------------------------------------------------------
  const handleCameraStream = (imageAsTensors) => {
    const loop = async () => {
      const nextImageTensor = await imageAsTensors.next().value;
      await getPrediction(nextImageTensor);
      requestAnimationFrameId = requestAnimationFrame(loop);
    };
    if (!predictionFound) loop();
  }

  // Helper function to reset all required state variables 
  // to start a fresh new translation routine! 
  const loadNewTranslation = () => {
    setTranslation('');
    setWord('');
    setPredictionFound(false);
    setTranslationAvailable(false);
  }

  // Helper function to show the Translation View. 
  const showTranslationView = () => {
    return <View style={styles.translationView}>
      {
        translationAvailable ?
          <View>
            <ScrollView style={{ height: 400 }}>
              <Text style={styles.translationTextField}>{translation}</Text>
              <Text style={styles.wordTextField}>{word}</Text>
            </ScrollView>
            <Button color='#9400D3' title="Check new word" onPress={() => loadNewTranslation()} />
          </View>
          : <ActivityIndicator size="large" />
      }
    </View>
  }

  //--------------------------------------------------------------------------------
  // Helper function to show the Camera View. 
  //
  // NOTE: Please note we are using TensorCamera component which is constructed 
  // on line: 37 of this function component. This is just a decorated expo.Camera 
  // component with extra functionality to stream Tensors, define texture dimensions
  // and other goods. For further research:
  // https://js.tensorflow.org/api_react_native/0.2.1/#cameraWithTensors
  //--------------------------------------------------------------------------------
  const renderCameraView = () => {
    return <View style={styles.cameraView}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        zoom={0}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={tensorDims.height}
        resizeWidth={tensorDims.width}
        resizeDepth={3}
        onReady={(imageAsTensors) => handleCameraStream(imageAsTensors)}
        autorender={true}
      />
      {/* <Text style={styles.legendTextField}>Point to any object and get its {availableLanguages.find(al => al.value === language).label} translation</Text> */}
    </View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          My Pictionary
        </Text>
      </View>

      <View style={styles.body}>
        {renderCameraView()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#E8E8E8',
  },
  header: {
    backgroundColor: '#41005d'
  },
  title: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff'
  },
  body: {
    padding: 5,
    paddingTop: 25
  },
  cameraView: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingTop: 10
  },
  camera: {
    width: 700 / 2,
    height: 800 / 2,
    zIndex: 1,
    borderWidth: 0,
    borderRadius: 0,
  },
  translationView: {
    marginTop: 30,
    padding: 20,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    height: 500
  },
  translationTextField: {
    fontSize: 60
  },
  wordTextField: {
    textAlign: 'right',
    fontSize: 20,
    marginBottom: 50
  },
  legendTextField: {
    fontStyle: 'italic',
    color: '#888888'
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'purple',
    borderStyle: 'solid',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#ffffff'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 3,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#cccccc'
  },
});


export default ScanTab;
