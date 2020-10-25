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
  TouchableHighlight,
  ScrollView,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";

import { addIngredientToFridge, clearIngredientsInFridge, updateIngredientInFridge } from "../../actions";
import AppTextInput from "../components/AppTextInput";
import {
  AppForm,
  AppFormField,
  AppFormPicker,
  SubmitButton,
  AppTextFormField,
} from "../components/forms";

// Database imports
import { openDatabase } from 'expo-sqlite';
import { date } from "yup";

const db = openDatabase("db2.db");

const inventoryFilter = [
  {
    id: 1,
    title: "All",
    select: true,
  },
  {
    id: 2,
    title: "Meat",
    select: false,
  },
  {
    id: 3,
    title: "Vegetable",
    select: false,
  },
  {
    id: 4,
    title: "Snack",
    select: false,
  },
  {
    id: 5,
    title: "Condiments",
    select: false,
  },
  {
    id: 6,
    title: "Fruit",
    select: false,
  },
  {
    id: 7,
    title: "Others",
    select: false,
  },
];

const screenWidth = Dimensions.get("window").width;

function IngredientsTab(state) {
  const { ingredients, addIngredientToFridge, clearIngredientsInFridge, updateIngredientInFridge } = state;
  const [forceUpdate, forceUpdateId] = useForceUpdate();

  const ingredientsInFridge = ingredients.fridge;

  const [ingrFilter, setIngrFilter] = useState(inventoryFilter);
  const toggleOnOff = (item) => {
    let temp = [...ingrFilter];
    temp = temp.map((invFilter) => {
      if (item.id === 1 && invFilter.select === true) {
        for (let i = 2; i < temp.length; i++) {
          ingrFilter[i].select === false;
        }
        return {
          id: invFilter.id,
          select: !invFilter.select,
          title: invFilter.title,
        };
      }
      if (item.id === invFilter.id)
        return {
          id: invFilter.id,
          select: !invFilter.select,
          title: invFilter.title,
        };
      else return invFilter;
    });
    setIngrFilter(temp);
  };

  const [modalVisible, setModalVisible] = useState(false);
  // console.log(modalVisible);
  const toggleModal = (ingredient) => {
    setModalVisible(!modalVisible);
    setSelectedIngre(ingredient);
  };
  const [selectedIngre, setSelectedIngre] = useState(null);

  
  const handleSubmit = async (values) => {
    // console.log("handleSubmit -> ", values);
    toggleModal(null);
    var expDate = new Date(new Date().getTime() + (values.dayToExp * 24 * 60 * 60 * 1000) + (24 * 60 * 60 * 1000)).toISOString();
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE FactFridge\
        SET ingredient = ?,\
          qty = ?,\
          unit = ?,\
          category = ?,\
          inFridge = ?,\
          expDate = ?\
        WHERE id = ?;", 
        [values.ingredient, values.qty, values.unit.label, values.category.label, values.inFridge, expDate, values.id], 
        () => {
          console.log('Update Values -> ', values);
          updateIngredientInFridge({
            id: values.id,
            ingredient: values.ingredient,
            category: values.category.label,
            qty: values.qty,
            expDate: expDate,
            unit: values.unit.label,
            imageUri: values.imageUri,
          })
        }, 
        (_, error) => console.log("IngredientTab updateIngre SQLite -> ", error)
      );
    },
    null,
    forceUpdate);
  }

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

  React.useEffect(() => {
    // Load ingredients from database
    clearIngredientsInFridge();
    
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM FactFridge",
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
            })
            // console.log("IngredientTab -> ", row)
          });
        },
        (_, error) => console.log("IngredientTab addIngre Redux -> ", error)
        );
      },
      null,
      forceUpdate);
  }, []);

  return (
    <Screen style={styles.screen}>
      <AppText
        style={{
          fontSize: 30,
          color: colors.primary,
          fontWeight: "bold",
          marginLeft: screenWidth * 0.05,
        }}
      >
        {"My Ingredients"}
      </AppText>
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
                  subTitle={"QTY: " + ingredientsInFridge[index].qty}
                  image={ingredientsInFridge[index].imageUri}
                  screenWidth={screenWidth}
                  expStatus={expDateToColor(ingredientsInFridge[index].expDate)[1]}
                  onPress={() => toggleModal(ingredientsInFridge[index])}
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
                  <ScrollView>
                  <Image
                    style={{
                      width: screenWidth - 150,
                      height: screenWidth - 200,
                      borderRadius: 15,
                    }}
                    source={{uri: selectedIngre.imageUri}}
                  />
                  <Text>{selectedIngre.id}</Text>
                    <AppForm
                      initialValues={{
                        id: selectedIngre.id,
                        ingredient: selectedIngre.ingredient,
                        qty: selectedIngre.qty.toString(),
                        unit: units.find(unit => unit.label === selectedIngre.unit) ,
                        category: categories.find(category => category.label === selectedIngre.category),
                        dayToExp: expDateToColor(selectedIngre.expDate)[0].toString(),
                        imageUri: selectedIngre.imageUri,
                        inFridge: 1,
                      }}
                      onSubmit={handleSubmit}
                      // validationSchema={validationSchema}
                    >
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
                      <SubmitButton title="SAVE"/>
                    </AppForm>
                    <AppButton 
                      title="CANCEL"
                      onPress={() => toggleModal(null)}
                      borderColor={colors.medium}
                      textColor={colors.medium}
                      />
                  </ScrollView>
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
  var dateDiff = Math.floor((expDate - today) / (1000*60*60*24));
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
      updateIngredientInFridge
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsTab);
