import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title, size }) {
  const { handleReset } = useFormikContext;
  const { handleSubmit } = useFormikContext;
  return (
    <AppButton title={title} onPress={(handleSubmit, handle)} size={size} />
  );
}

const styles = StyleSheet.create({});

export default SubmitButton;
