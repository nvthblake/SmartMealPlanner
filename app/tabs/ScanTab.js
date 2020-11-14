import React, { useState } from "react";
import {
  StyleSheet,
  Button,
  Image,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
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
import FormImageStatic from "../components/forms/FormImageStatic";
import pickerOptions from "../config/pickerOptions";
import AppText from "../components/AppText";

import { addIngredientToFridge, deleteIngredientToScan } from "../../actions";
import { getFridgeSql } from "../components/database/queries";
import AppButton from "../components/AppButton";
import colors from "../config/colors";

const db = openDatabase("db2.db");

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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
    // const imageUri = "file:/data/user/0/host.exp.exponent/cache/ExperienceData/%2540anonymous%252FSmartMealPlanner-c7f11723-ddae-4ba6-97f3-0120a5d82b7e/ImagePicker/acface9b-60ad-40d8-886d-43347ba91603.jpg";
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
            values.imageUri,
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
                      imageUri: values.imageUri,
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
      console.log("ScanTab deleted uri -> ", values.imageUri);
      deleteIngredientToScan(values.imageUri);
      console.log("Ingredient to scan -> ", ingredientToScan);
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
          snapToAlignment={"center"}
          snapToInterval={screenWidth - 30}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(ingredientToScan) => ingredientToScan.imageUri}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.cardContainer}>
                <ScrollView style={{ flex: 1 }}>
                  <AppForm
                    initialValues={{
                      ingredient: "",
                      qty: "",
                      unit: null,
                      category: null,
                      dayToExp: "",
                      imageUri: item.imageUri,
                    }}
                    onSubmit={handleSubmit}
                    validationSchema={validationSchema}
                  >
                    <FormImageStatic name="imageUri" />
                    <AppFormField
                      icon="food-variant"
                      name="ingredient"
                      placeholder="Ingredient"
                      clearButtonMode="while-editing"
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <AppFormField
                        icon="pound"
                        name="qty"
                        placeholder="Quantity"
                        keyboardType="numeric"
                        width={150}
                        marginRight={20}
                      />
                      <AppFormPicker
                        icon="beaker"
                        items={pickerOptions.units}
                        name="unit"
                        placeholder="Unit"
                        width={150}
                        marginLeft={20}
                      />
                    </View>
                    <AppFormPicker
                      icon="menu"
                      items={pickerOptions.categories}
                      name="category"
                      placeholder="Category"
                    />
                    <AppFormField
                      icon="calendar-remove"
                      name="dayToExp"
                      placeholder="Days to Expiration"
                      keyboardType="numeric"
                    />
                    <SubmitButton title="ADD TO FRIDGE" />
                  </AppForm>
                </ScrollView>
              </View>
            );
          }}
        ></FlatList>
      </View>
      <View></View>
      <AppButton
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
  cardContainer: {
    borderRadius: 25,
    borderWidth: 4,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginHorizontal: 10,
    width: screenWidth * 0.85,
    height: screenHeight * 0.75,
    backgroundColor: "white",
    overflow: "hidden",
  },
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
