import React from "react";
import { Image,Dimensions } from "react-native";
import { useFormikContext } from "formik";

import ErrorMessage from "./ErrorMessage";
import ImageInputList from "../ImageInputList";

function FormImageStatic({ name }) {
  const { values } = useFormikContext();
  const imageUris = values[name];

  const screenWidth = Dimensions.get("window").width;


  return (
    <>
      <Image
        style={{
            width: "100%",
            height: 0.5 * screenWidth,
            borderRadius: 20,
        }}
        source={{ uri: imageUris }}
      />
    </>
  );
}

export default FormImageStatic;
