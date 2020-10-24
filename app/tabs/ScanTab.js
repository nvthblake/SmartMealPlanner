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

import { addIngredientToFridge } from "../../actions";

const db = openDatabase("db2.db");

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
  { label: "Quartz", value: 1 },
  { label: "Kg", value: 2 }
]

function ScanTab(state) {
  const { ingredients, addIngredientToFridge } = state;
  const ingredientsInFridge = ingredients.fridge;

  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    var expDate = new Date(new Date().getTime() + (values.dayToExp * 24 * 60 * 60 * 1000)).toISOString();
    // Insert new ingredient to SQLite database
    db.transaction(tx => {
      tx.executeSql(
        "INSERT INTO FactFridge (ingredient, qty, unit, category, dayToExp, inFridge, expDate) values (?, ?, ?, ?, ?, ?, ?)",
        [values.ingredient, values.qty, values.unit.label, values.category.label, values.dayToExp, 1, expDate],
        () => {
          setSuccess(true)
          db.transaction(tx => {
            tx.executeSql(
              "SELECT MAX(ID) AS ID FROM FactFridge",
              [],
              (_, { rows }) => {
                console.log("handleSubmit -> rows", rows)
                const row = rows._array[0];
                console.log("handleSubmit -> row", row)
                addIngredientToFridge({
                  id: row.ID,
                  title: values.ingredient,
                  categoryName: values.category.label,
                  quantity: values.qty,
                  expirationDate: 'red',
                  imageUrl: require("../assets/appIcon/Honeycrisp.jpg"),
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
  }

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
        onSubmit={handleSubmit}
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