import React from "react";
import { StyleSheet } from "react-native";
import { useFormikContext } from "formik";

import AppButton from "../AppButton";

function SubmitButton({ title, size }) {
<<<<<<< HEAD
  const { handleSubmit } = useFormikContext();
  return <AppButton title={title} onPress={handleSubmit} size={size} />;
=======
  const { handleReset } = useFormikContext;
  const { handleSubmit } = useFormikContext;
  return (
    <AppButton title={title} onPress={(handleSubmit, handle)} size={size} />
  );
>>>>>>> blake-dev
}

const styles = StyleSheet.create({});

export default SubmitButton;
