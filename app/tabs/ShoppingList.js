import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableHighlight,
  TextInput
} from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import AppText from "../components/AppText";
import colors from "../config/colors";
import ShoppingItem from "../components/ShoppingItem";

const screenWidth = Dimensions.get("window").width;

function ShoppingList(props) {
  // Item states
  const [todos, setTodos] = useState([
    { text: "buy coffee", key: "1" },
    { text: "buy candies", key: "2" },
    { text: "buy kitkat", key: "3" },
  ]);
  const [text, setText] = useState('');
  const changeHandler = (val) => {
      setText(val)
  }
  const pressHandler = (key) => {
    setTodos((prevCheck) => {
      return prevCheck.filter((check) => check.key != key);
    });
  };
  const submitHandler =() => {
    setTodos((prevCheck) => {
        return [
            {text: text, key: Math.random().toString() },
            ...prevCheck
        ];
    })
  }
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <AppText style={styles.textformat}>{"Shopping List"}</AppText>
            <View style={styles.underline} />
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Image
              source={require("../assets/appIcon/plus.jpg")}
              style={styles.plusButton}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.list}>
          <FlatList
            data={todos}
            renderItem={({ item }) => (
              <ShoppingItem 
                item={item}   
                pressHandler={pressHandler} />
            )}
          />
        </View>
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
                    placeholder='Add item to buy'
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
    </View>
  );
}

const styles = StyleSheet.create({
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
    color: colors.primary,
    fontWeight: "bold"
  },
  underline: {
    borderBottomColor: colors.primary,
    borderBottomWidth: 2,
    width: 205,
  },
  list: {
    marginTop: 20,
  },
  plusButton: {
    marginTop: 10,
    width: 25,
    height: 25,
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
    width: 110
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 110,
    marginLeft: 50
  },
});

export default ShoppingList;
