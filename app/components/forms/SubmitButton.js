import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";
import CustomButton from "../CustomButton";

function SubmitButton({ title, size, color, textColor, height }) {
  const { handleSubmit } = useFormikContext();
  return (
    <CustomButton
      title={title}
      onPress={handleSubmit}
      size={size}
      color={color}
      textColor={textColor}
      height={height}
    />
  );
}

const styles = StyleSheet.create({});

export default SubmitButton;
