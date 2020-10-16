import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";


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
        onSubmit={(values) => {console.log(values)}}
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ScanTab;
