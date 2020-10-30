import React, { useState } from "react";
import { StyleSheet, Button, Image, View, FlatList, Dimensions } from "react-native";
import * as Yup from "yup";
import { openDatabase } from "expo-sqlite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";

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
import AppButton from "../components/AppButton";

const db = openDatabase("db2.db");

const screenWidth = Dimensions.get("window").width;

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
  const ingredientToScan = ingredients.ingredientToScan;

  const [forceUpdate, forceUpdateId] = useForceUpdate();
  const [success, setSuccess] = useState(true);

  const handleSubmit = async (values, { resetForm }) => {
    var expDate = new Date(
      new Date().getTime() + values.dayToExp * 24 * 60 * 60 * 1000
    ).toISOString();
    // Insert new ingredient to SQLite database
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO FactFridge (ingredient, qty, unit, category, dayToExp, inFridge, expDate, imageUri) values (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            values.ingredient,
            values.qty,
            values.unit.label,
            values.category.label,
            values.dayToExp,
            1,
            expDate,
            values.images[0],
          ],
          () => {
            setSuccess(true);
            db.transaction(
              (tx) => {
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
                      imageUri: values.images[0],
                    });
                  },
                  (_, error) => console.log(error)
                );
              },
              null,
              forceUpdate
            );
          },
          (_, error) => {
            setSuccess(false);
            console.log(error);
          }
        );
      },
      null,
      forceUpdate
    );
    if (success) {
      resetForm();
      setSuccess(false);
    }
    // console.log(getFridgeSql(db));
  };

  const navigation = useNavigation();

  return (
    <Screen style={styles.container}>
      <View>
        <FlatList
          data={ingredientToScan}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(ingredientToScan) => ingredientToScan.imageUri}
          renderItem={({ item, index }) => {
            // console.log("item image ->", item.imageUri);
            return (
              <View
                style={{height: 1000, width: screenWidth*0.85}}
              >
                <Image
                  style={{ height: 80, width: 80 }}
                  source={{ uri: ingredientToScan[index].imageUri}}
                />
                <AppForm
                  initialValues={{
                    ingredient: "",
                    qty: "",
                    unit: null,
                    category: null,
                    dayToExp: "",
                    images: item.imageUri,
                  }}
                  onSubmit={handleSubmit}
                  validationSchema={validationSchema}
                >
                  <AppFormField name="ingredient" placeholder="Ingredient" />
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
                  <SubmitButton title="ADD TO FRIDGE" />
                </AppForm>
              </View>
            )
          }}
        >
        </FlatList>
      </View>
      {/* <View >
        <Image style={styles.logo} source={{uri: ingredientToScan[0].imageUri}} />
      </View> */}
      <View>
      </View>
      <Button
        title={"SCAN FOOD"}
        onPress={() => navigation.navigate("Camera")}
      />
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
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
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
