import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title, size }) {
  const { handleSubmit } = useFormikContext();
  return <AppButton title={title} onPress={handleSubmit} size={size} />;
}

const styles = StyleSheet.create({});

export default SubmitButton;
