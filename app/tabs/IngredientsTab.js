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

import { addIngredientToFridge } from "../../actions";
import AppTextInput from "../components/AppTextInput";

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
  const { ingredients, addIngredientToFridge } = state;
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

  return (
    <Screen style={styles.screen}>
      {/* <AppButton
        color={"blue"}
        onPress={() => {
          addIngredientToFridge({
            id: Math.floor(Math.random() * Math.floor(10000000)),
            title: "Couch with all kinds of stain",
            categoryName: "Condiment",
            quantity: 10,
            expirationDate: "red",
            imageUrl: require("../assets/couch.jpg"),
          })
        }}
        title={"Hello"}
      /> */}
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
                  title={ingredientsInFridge[index].title}
                  subTitle={"QTY: " + ingredientsInFridge[index].quantity}
                  image={ingredientsInFridge[index].imageUrl}
                  screenWidth={screenWidth}
                  expStatus={ingredientsInFridge[index].expirationDate}
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
                  "Save the Changes?",
                  "Are you sure you want to save the changes?",
                  [
                    {
                      text: "Discard Changes",
                      onPress: () => console.log("Canceled Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "Yes",
                      onPress: () => console.log("Yes Pressed"),
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
                      source={selectedIngre.imageUrl}
                    />
                    <AppTextInput
                      icon={"food-variant"}
                      title={selectedIngre.title}
                    />
                    <AppTextInput
                      icon={"pound"}
                      title={selectedIngre.quantity.toString()}
                    />
                    <AppTextInput
                      icon={"calendar-remove-outline"}
                      title={selectedIngre.expirationDate}
                    />
                    {/* <AppText>
                      {"Category: " + selectedIngre.categoryName}
                    </AppText> */}
                    <View
                      style={{
                        width: "100%",
                        height: 60,
                        backgroundColor: colors.light,
                        borderRadius: 25,
                        marginVertical: 10,
                      }}
                    >
                      <MaterialCommunityIcons
                        name="menu-open"
                        size={15}
                        color={colors.medium}
                      />
                      <Picker
                        selectedValue={selectedIngre.categoryName}
                        onValueChange={(itemValue, itemIndex) =>
                          setIngrFilter(itemValue)
                        }
                      >
                        <Picker.Item label="Meat" value="Meat" />
                        <Picker.Item label="Vegetable" value="Vegetable" />
                        <Picker.Item label="Fruit" value="Fruit" />
                        <Picker.Item label="Snack" value="Snack" />
                        <Picker.Item label="Condiments" value="Condiments" />
                        <Picker.Item label="Others" value="Others" />
                      </Picker>
                    </View>
                    <TouchableHighlight
                      style={{
                        ...styles.modalButton,
                        backgroundColor: "#2196F3",
                      }}
                      onPress={() => toggleModal(null)}
                    >
                      <Text style={{ color: "white", textAlign: "center" }}>
                        Close and Save Changes
                      </Text>
                    </TouchableHighlight>
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

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsTab);
