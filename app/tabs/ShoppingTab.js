import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableHighlight,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
  TouchableOpacity
} from "react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ShoppingItem from "../components/ShoppingItem";
import { AntDesign, Feather } from "@expo/vector-icons";
import Map from "../components/GoogleMap";

/* Redux */
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addIngredientToCart, deleteIngredientInCart, clearCart, addIngredientToFridge } from "../../actions";

// Dimensions 
const windowHeight = Dimensions.get('window').height;

function ShoppingList(props) {
  const { ingredients, addIngredientToCart, deleteIngredientInCart, clearCart } = props;

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
    addIngredientToCart({ name: text, id: Math.random().toString() })
  };

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);

  // HTML constructor
  return (
    <Screen style={styles.screen} headerTitle="Shopping List">
      <View style={{
          marginLeft: screenWidth * 0.05,
          marginRight: screenWidth * 0.05,
          paddingBottom: 50,
        }}>
        <View style={styles.header}>
          <View>
            <AppText style={styles.textformat}>{"Shopping List"}</AppText>
          </View>
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
            style={{ marginLeft: 30 }}
          >
            <Feather
              name="trash-2"
              size={35}
              color={colors.black}
              style={styles.plusButton}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <AntDesign
              name="pluscircleo"
              size={37}
              color={colors.black}
              style={styles.plusButton}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mapContainer}>
          <Map />
        </View>

        <FlatList
          style={styles.list}
          data={ingredientsInCart}
          keyExtractor={(ingredient) => ingredient.id + "cart"}
          renderItem={({ ingredient, index }) => (
            <ShoppingItem item={ingredientsInCart[index]} pressHandler={pressHandler} />
          )}
        />
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput
                  style={styles.modalText}
                  placeholder="Add item to buy"
                  onChangeText={changeHandler}
                />
                <View style={styles.header}>
                  <TouchableHighlight
                    style={styles.closeButton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>CLOSE</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={styles.addButton}
                    onPress={() => {
                      submitHandler();
                      setModalVisible(!modalVisible);
                    }}
                  >
                    <Text style={styles.textStyle}>ADD ITEM</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 20,
    backgroundColor: colors.light,
  },
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  content: {
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
    marginTop: 20,
    height: windowHeight * 0.4
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
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 110,
    marginLeft: 50,
  },
  mapStyle: {
    height: 300,
  },
  mapContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: colors.primary,
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
      addIngredientToCart, deleteIngredientInCart, clearCart
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);
