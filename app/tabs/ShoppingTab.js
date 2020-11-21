import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ShoppingItem from "../components/ShoppingItem";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Map from "../components/GoogleMap";
import Modal from "react-native-modal";

/* Redux */
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addIngredientToCart,
  deleteIngredientInCart,
  clearCart,
  addIngredientToFridge,
} from "../../actions";
import AppTextInput from "../components/AppTextInput";
import CustomButton from "../components/CustomButton";

// Dimensions
const windowHeight = Dimensions.get("window").height;

function ShoppingTab(props) {
  const {
    ingredients,
    addIngredientToCart,
    deleteIngredientInCart,
    clearCart,
  } = props;

  const ingredientsInCart = ingredients.cart;

  const screenWidth = Dimensions.get("window").width;

  const [text, setText] = useState("");
  const changeHandler = (val) => {
    setText(val);
  };

  const pressHandler = (ingredient) => {
    deleteIngredientInCart(ingredient);
  };

  const submitHandler = () => {
    addIngredientToCart({ name: text, id: Math.random().toString() });
  };

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  // HTML constructor
  return (
    <Screen style={styles.screen} headerTitle="Shopping List">
      <ScrollView
        style={{
          marginLeft: screenWidth * 0.05,
          marginRight: screenWidth * 0.05,
          paddingBottom: 50,
        }}
      >
        <View style={styles.mapContainer}>
          <Map />
        </View>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Delete all shopping items?",
                "Press OK to proceed",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => clearCart() },
                ],
                { cancelable: false }
              );
            }}
            style={{ marginRight: 10 }}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color={colors.danger}
              style={styles.plusButton}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <MaterialCommunityIcons
              name="plus"
              size={30}
              color={colors.primary}
              style={styles.plusButton}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={styles.list}
          data={ingredientsInCart}
          keyExtractor={(ingredient) => ingredient.id + "cart"}
          renderItem={({ ingredient, index }) => (
            <ShoppingItem
              item={ingredientsInCart[index]}
              pressHandler={pressHandler}
            />
          )}
        />
        <View style={styles.centeredView}>
          <Modal
            backdropColor={"#F2F5F8"}
            backdropOpacity={0.5}
            coverScreen={true}
            isVisible={modalVisible}
            onBackdropPress={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <AppText style={{ paddingBottom: 5 }}>
                  Add Item to Shopping List
                </AppText>
                <AppTextInput
                  // style={styles.modalText}
                  // placeholder="Add item to buy"
                  onChangeText={changeHandler}
                />
                <View style={styles.buttonContainer}>
                  <CustomButton
                    title="CLOSE"
                    color={colors.danger}
                    textColor={colors.white}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  />
                  <CustomButton
                    title="ADD ITEM"
                    color={colors.primary}
                    textColor={colors.white}
                    onPress={() => {
                      submitHandler();
                      setModalVisible(!modalVisible);
                    }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20,
    backgroundColor: colors.light,
  },
  header: {
    // flex: 1,
    // backgroundColor: "red",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textformat: {
    fontSize: 30,
    color: colors.font_white,
    fontWeight: "bold",
  },
  underline: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 205,
  },
  list: {
    // backgroundColor: "yellow",
    // marginBottom: 20,
    flex: 1,
    // height: windowHeight * 0.3,
  },
  plusButton: {
    marginTop: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    backgroundColor: colors.secondary,
    width: "100%",
    marginBottom: 15,
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  closeButton: {
    backgroundColor: "red",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 110,
    marginHorizontal: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 110,
    marginHorizontal: 10,
  },
  mapStyle: {
    height: 300,
  },
  mapContainer: {
    margin: 10,
    elevation: 10,
    borderRadius: 15,
    overflow: "hidden",
  },
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addIngredientToCart,
      deleteIngredientInCart,
      clearCart,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingTab);
