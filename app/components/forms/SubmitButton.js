import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";
import CustomButton from "../CustomButton";

function SubmitButton({ title, size }) {
  const { handleSubmit } = useFormikContext();
  return <CustomButton title={title} onPress={handleSubmit} size={size} />;
}

const styles = StyleSheet.create({});

export default SubmitButton;
