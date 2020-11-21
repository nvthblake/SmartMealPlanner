import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import * as Yup from "yup";
import { openDatabase } from "expo-sqlite";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import FormImageStatic from "../components/forms/FormImageStatic";
import pickerOptions from "../config/pickerOptions";

import { addIngredientToFridge, deleteIngredientToScan } from "../../actions";
import { getFridgeSql } from "../components/database/queries";
import colors from "../config/colors";
import CameraPage from "./pages/CameraPage";
import {} from "react-native-gesture-handler";
import AddFoodButton from "../components/forms/AddFoodButton";

const db = openDatabase("db2.db");

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const validationSchema = Yup.object().shape({
  ingredient: Yup.string().required().min(1).label("Ingredient"),
  category: Yup.object().required().nullable().label("Category"),
  dayToExp: Yup.number().required().min(1).label("Days to Expiration"),
  images: Yup.array().min(1, "Please select at least 1 image."),
});

function ScanTab(state) {
  const { ingredients, addIngredientToFridge, deleteIngredientToScan } = state;
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
      deleteIngredientToScan(values.imageUri);
      resetForm();
      setSuccess(false);
    }
  };

  const [viewHeight, setViewHeight] = useState(screenWidth * 0.5);

  const navigation = useNavigation();

  return (
    <Screen>
      <View style={styles.container}>
        <CameraPage />
        <FlatList
          data={ingredientToScan}
          horizontal
          snapToAlignment={"center"}
          snapToInterval={screenWidth * 0.9}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(ingredientToScan) => ingredientToScan.imageUri}
          renderItem={({ item, index }) => {
            return (
              <View
                style={styles.cardContainer}
                onLayout={(event) => {
                  var { x, y, width, height } = event.nativeEvent.layout;
                  setViewHeight(height);
                  // console.log(viewHeight);
                }}
              >
                <View
                  style={{ flex: 1 }}
                  // showsVerticalScrollIndicator={false}
                >
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
                    <ScrollView>
                      <FormImageStatic
                        name="imageUri"
                        height={viewHeight - 313}
                      />
                      <View
                        style={{
                          position: "absolute",
                          top: 7,
                          right: 7,
                          backgroundColor: "rgba(0,0,0,0.3)",
                          borderRadius: 5,
                        }}
                      >
                        <TouchableWithoutFeedback
                          onPress={() => {
                            Alert.alert(
                              "Delete Ingredient?",
                              "Are you sure you want to remove this ingredient?",
                              [
                                {
                                  text: "No",
                                  style: "cancel",
                                },
                                {
                                  text: "Yes",
                                  onPress: () => {
                                    // Delete ingredient from Redux
                                    deleteIngredientToScan(item.imageUri);
                                  },
                                },
                              ],
                              { cancelable: true }
                            );
                          }}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            size={30}
                            color={colors.white}
                          />
                        </TouchableWithoutFeedback>
                      </View>
                    </ScrollView>
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
                        width={screenWidth * 0.38}
                        marginRight={9}
                      />
                      <AppFormPicker
                        icon="beaker"
                        items={pickerOptions.units}
                        name="unit"
                        placeholder="Unit"
                        width={screenWidth * 0.38}
                        marginLeft={9}
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
                    <AddFoodButton
                      title="ADD TO FRIDGE"
                      color={colors.secondary}
                      textColor={colors.primary}
                      height={50}
                      size={18}
                    />
                  </AppForm>
                </View>
              </View>
            );
          }}
        ></FlatList>
      </View>
    </Screen>
  );
}

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    borderRadius: 25,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    width: screenWidth * 0.85,
    // height: screenHeight * 0.65,
    // height: "100%",
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: "column",
    height: "100%",
    // backgroundColor: "red",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
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
      deleteIngredientToScan,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ScanTab);
