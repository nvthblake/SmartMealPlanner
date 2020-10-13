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
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  image: Yup.array().min(1, "Please select at least 1 image."),
});

const categories = [
  { label: "Meat", value: 1, backgroundColor: "red", icon: "apps" },
  { label: "Vegetable", value: 2, backgroundColor: "green", icon: "email" },
  { label: "Condiments", value: 3, backgroundColor: "blue", icon: "lock" },
  { label: "Snack", value: 4, backgroundColor: "blue", icon: "lock" },
  { label: "Fruit", value: 5, backgroundColor: "blue", icon: "lock" },
  { label: "Others", value: 6, backgroundColor: "blue", icon: "lock" },
];

function ListingEditScreen() {
 
 
  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          images: [],
        }}
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <AppFormField maxLength={255} name="title" placeholder="Title" />
        <AppFormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
        />
        <AppFormPicker
          items={categories}
          name="category"
          // numberOfColumns={3} // Comment this out to display only 1 column
          // PickerItemComponent={CategoryPickerItem} // comment this out if dont want to display icon
          placeholder="Category"
        />
        <AppFormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
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

export default ListingEditScreen;
