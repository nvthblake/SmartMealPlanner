import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Picker } from "@react-native-community/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  View,
  Image,
  Text,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";
import pickerOptions from "../config/pickerOptions";

import {
  addIngredientToFridge,
  clearIngredientsInFridge,
  updateIngredientInFridge,
  deleteIngredientInFridge,
} from "../../actions";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
} from "../components/forms";

// Database imports
import { openDatabase } from "expo-sqlite";
import { date } from "yup";

const db = openDatabase("db2.db");

const inventoryFilter = pickerOptions.inventoryFilter;

const screenWidth = Dimensions.get("window").width;

function IngredientsTab(state) {
  const {
    ingredients,
    addIngredientToFridge,
    clearIngredientsInFridge,
    updateIngredientInFridge,
    deleteIngredientInFridge,
  } = state;
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const ingredientsInFridge = ingredients.fridge;

  const [ingrFilter, setIngrFilter] = useState(inventoryFilter);
  
  const updateFilter = () => {
    let sqlQuery = "SELECT * FROM FactFridge";
    if (inventoryFilter[0].select === false) {
      sqlQuery = sqlQuery.concat(" WHERE Category IN (");
      const categoryFiltered = inventoryFilter.filter(c => c.select === true).map(c => `'${c.title}'`);
      sqlQuery = sqlQuery.concat(categoryFiltered.join(",")).concat(");");
    }
    // Load ingredients from database
    clearIngredientsInFridge();

    db.transaction(
      (tx) => {
        tx.executeSql(
          sqlQuery,
          [],
          (_, { rows }) => {
            rows._array.forEach((row) => {
              addIngredientToFridge({
                id: row.id,
                ingredient: row.ingredient,
                category: row.category,
                qty: row.qty,
                expDate: row.expDate,
                unit: row.unit,
                imageUri: row.imageUri,
              });
            });
          },
          (_, error) => console.log("IngredientTab addIngre Redux -> ", error)
        );
      },
      null,
      forceUpdate
    );
  }

  const toggleOnOff = (item) => {
    let temp = [...ingrFilter];
    if (item.id === 0) {
      for (let i = 0; i < temp.length; i++) {
        if (item.id === i) {
          temp[i].select = true;
        }
        else {
          temp[i].select = false;
        }
      }
    }
    else if (item.id !== 0) {
      for (let i = 0; i < temp.length; i++) {
        if (i === item.id) {
          temp[i].select = !temp[i].select;
        }
      }
      let countSelected = temp.filter(t => t.select === true).length;
      if ( countSelected === 0 ) {
        temp[0].select = true;
      }
      else {
        temp[0].select = false;
      }
    }
    setIngrFilter(temp);
    updateFilter();
  };

  const [modalVisible, setModalVisible] = useState(false);
  const toggleModal = (ingredient) => {
    setModalVisible(!modalVisible);
    setSelectedIngre(ingredient);
  };
  const [selectedIngre, setSelectedIngre] = useState(null);

  const handleSubmit = async (values) => {
    toggleModal(null);
    var expDate = new Date(
      new Date().getTime() +
        values.dayToExp * 24 * 60 * 60 * 1000 +
        24 * 60 * 60 * 1000
    ).toISOString();
    db.transaction(
      (tx) => {
        tx.executeSql(
          "UPDATE FactFridge\
          SET ingredient = ?,\
          qty = ?,\
          unit = ?,\
          category = ?,\
          inFridge = ?,\
          expDate = ?\
          WHERE id = ?;",
          [
            values.ingredient,
            values.qty,
            values.unit.label,
            values.category.label,
            values.inFridge,
            expDate,
            values.id,
          ],
          () => {
            console.log("Update Values -> ", values);
            updateIngredientInFridge({
              id: values.id,
              ingredient: values.ingredient,
              category: values.category.label,
              qty: values.qty,
              expDate: expDate,
              unit: values.unit.label,
              imageUri: values.imageUri,
            });
          },
          (_, error) =>
            console.log("IngredientTab updateIngre SQLite -> ", error)
        );
      },
      null,
      forceUpdate
    );
  };

  const handleDelete = (ingredient) => {
    Alert.alert(
      "Delete Ingredient?",
      "Are you sure you want to remove ingredient from your fridge?",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log(ingredient);
            // Delete ingredient from Redux
            deleteIngredientInFridge(ingredient);
            // Delete ingredient from SQLite
            db.transaction(
              (tx) => {
                tx.executeSql(
                  "DELETE FROM FactFridge WHERE id = ?",
                  [ingredient.id],
                  [],
                  (_, error) => console.log(error)
                );
              },
              null,
              forceUpdate
            );
            toggleModal(null);
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  React.useEffect(updateFilter, []);

  return (
    <Screen style={styles.screen} headerTitle="Ingredients">
      <View
        style={{
          marginLeft: screenWidth * 0.05,
          marginRight: screenWidth * 0.05,
        }}
      >
        <FlatList
          data={ingrFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <AppButton
              color={item.select ? colors.primary : colors.white}
              textColor={item.select ? colors.white : colors.primary}
              onPress={() => toggleOnOff(item)}
              title={item.title}
            />
          )}
        ></FlatList>
      </View>
      <View style={{ marginBottom: 85 }}>
        <FlatList
          columnWrapperStyle={styles.gridView}
          numColumns={3}
          data={ingredientsInFridge}
          keyExtractor={(ingredient) => ingredient.id.toString()}
          renderItem={({ ingredient, index }) => {
            return (
              <>
                <SqCard
                  title={ingredientsInFridge[index].ingredient}
                  subTitle1={`${ingredientsInFridge[index].qty} ${ingredientsInFridge[index].unit}`}
                  subTitle2={`${expDateToColor(ingredientsInFridge[index].expDate)[0]} days`}
                  image={ingredientsInFridge[index].imageUri}
                  screenWidth={screenWidth}
                  expStatus={
                    expDateToColor(ingredientsInFridge[index].expDate)[1]
                  }
                  onPress={() => toggleModal(ingredientsInFridge[index])}
                  onLongPress={() => {
                    handleDelete(ingredientsInFridge[index]);
                  }}
                ></SqCard>
              </>
            );
          }}
        />
        {selectedIngre ? (
          <View style={styles.centeredView}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert(
                  "Exit Change Window?",
                  "Are you sure you want to discard any changes made?",
                  [
                    {
                      text: "Yes",
                      onPress: () => toggleModal(null),
                    },
                    {
                      text: "No",
                      style: "cancel",
                    },
                  ],
                  { cancelable: true }
                );
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Image
                    style={{
                      width: screenWidth*0.85,
                      height: screenWidth*0.85*0.66,
                      borderRadius: 15,
                    }}
                    source={{ uri: selectedIngre.imageUri }}
                  />
                    <AppForm
                      initialValues={{
                        id: selectedIngre.id,
                        ingredient: selectedIngre.ingredient,
                        qty: selectedIngre.qty.toString(),
                        unit: pickerOptions.units.find(
                          (unit) => unit.label === selectedIngre.unit
                        ),
                        category: pickerOptions.categories.find(
                          (category) =>
                            category.label === selectedIngre.category
                        ),
                        dayToExp: expDateToColor(
                          selectedIngre.expDate
                        )[0].toString(),
                        imageUri: selectedIngre.imageUri,
                        inFridge: 1,
                      }}
                      onSubmit={handleSubmit}
                      // validationSchema={validationSchema}
                    >
                      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        <AppFormField
                          icon="food-variant"
                          name="ingredient"
                          placeholder="Ingredient"
                          width={0.85 * screenWidth}
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
                            width={screenWidth*0.40}
                            marginRight={10}
                          />
                          <AppFormPicker
                            icon="beaker"
                            items={pickerOptions.units}
                            name="unit"
                            placeholder="Unit"
                            width={screenWidth*0.40}
                            marginLeft={10}
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
                      </ScrollView>
                      <SubmitButton title="SAVE" />
                      <AppButton
                        title="DELETE"
                        onPress={() => handleDelete(selectedIngre)}
                        borderColor={colors.maroon}
                        textColor={colors.maroon}
                      />
                      <AppButton
                        title="CANCEL"
                        onPress={() => toggleModal(null)}
                        borderColor={colors.medium}
                        textColor={colors.medium}
                      />
                    </AppForm>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <></>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 0.85,
    // alignSelf: "baseline",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 150,
    marginTop: 10,
  },
  modalImg: {
    borderRadius: 15,
  },
  screen: {
    paddingVertical: 20,
    backgroundColor: colors.light,
  },
  gridView: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  AppButton: {
    borderRadius: 10,
  },
});

function useForceUpdate() {
  const [value, setValue] = useState(0);
  return [() => setValue(value + 1), value];
}

function expDateToColor(expDateStr) {
  const today = new Date();
  const expDate = Date.parse(expDateStr);
  var dateDiff = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
  if (dateDiff <= 4) return [dateDiff, "red"];
  else if (dateDiff <= 8) return [dateDiff, "orange"];
  else if (dateDiff <= 14) return [dateDiff, "yellow"];
  else return [dateDiff, "green"];
}

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addIngredientToFridge,
      clearIngredientsInFridge,
      updateIngredientInFridge,
      deleteIngredientInFridge,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsTab);
