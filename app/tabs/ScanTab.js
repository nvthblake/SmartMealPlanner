import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";
import { openDatabase } from 'expo-sqlite';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/forms/FormImagePicker";
import pickerOptions from "../config/pickerOptions";

import { addIngredientToFridge } from "../../actions";
import { getFridgeSql } from "../components/database/queries";

const db = openDatabase("db2.db");

const validationSchema = Yup.object().shape({
  ingredient: Yup.string().required().min(1).label("Ingredient"),
  qty: Yup.number().required().min(1).max(10000).label("Quantity"),
  unit: Yup.object().required().nullable().label("Unit"),
  category: Yup.object().required().nullable().label("Category"),
  dayToExp: Yup.number().required().min(1).label("Days to Expiration"),
  images: Yup.array().min(1, "Please select at least 1 image."),
});


function ScanTab(state) {
  const { ingredients, addIngredientToFridge } = state;
  const ingredientsInFridge = ingredients.fridge;

  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [success, setSuccess] = useState(true);

  const handleSubmit = async (values, { resetForm }) => {
    console.log(values);
    const images =  "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/893d8e21-600b-493c-b041-010012287bc4.jpg";
    var expDate = new Date(new Date().getTime() + (values.dayToExp * 24 * 60 * 60 * 1000)).toISOString();
    // Insert new ingredient to SQLite database
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO FactFridge (ingredient, qty, unit, category, dayToExp, inFridge, expDate, imageUri) values (?, ?, ?, ?, ?, ?, ?, ?)",
        [values.ingredient, values.qty, values.unit.label, values.category.label, values.dayToExp, 1, expDate, images],
        () => {
          setSuccess(true);
          db.transaction(tx => {
            tx.executeSql(
              "SELECT MAX(ID) AS ID FROM FactFridge",
              [],
              (_, { rows }) => {
                const row = rows._array[0];
                addIngredientToFridge({
                  id: row.ID,
                  ingredient: values.ingredient,
                  qty: values.qty,
                  unit: values.unit.label,
                  category: values.category.label,
                  expDate: expDate,
                  imageUri: images,
                })
              },
              (_, error) => console.log(error)
            );
          },
            null,
            forceUpdate);
        },
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
    // console.log(getFridgeSql(db));
  }

  return (
    <Screen style={styles.container}>
      <AppForm
        initialValues={{
          ingredient: "Meoa",
          qty: "44",
          unit: null,
          category: null,
          dayToExp: "5",
          // images: "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/893d8e21-600b-493c-b041-010012287bc4.jpg",
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {/* <FormImagePicker name="images" /> */}
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
          items={pickerOptions.units}
          name="unit"
          placeholder="Unit"
        />
        <AppFormPicker
          items={pickerOptions.categories}
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

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addIngredientToFridge,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ScanTab);