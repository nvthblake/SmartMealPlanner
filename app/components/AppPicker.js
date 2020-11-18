import React, { useState } from "react";
import {
  Button,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableHighlight,
  Text
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import PickerItem from "./PickerItem";
import colors from "../config/colors";

function AppPicker({
  icon,
  items,
  numberOfColumns = 1,
  onSelectItem,
  placeholder,
  selectedItem,
  width = "100%",
  marginHorizontal = 0,
  marginLeft = 0,
  marginRight = 0,
  PickerItemComponent = PickerItem,
  ...otherProps
}) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View
          style={[
            styles.container,
            { width, marginHorizontal, marginLeft, marginRight },
          ]}
        >
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}
          {selectedItem ? (
            <AppText style={styles.text}>{selectedItem.label}</AppText>
          ) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.grey}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight style={styles.button} onPress={() => setModalVisible(false)} >
            <Text style={styles.textStyle}>CLOSE</Text>
            </TouchableHighlight>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value.toString()}
              numColumns={numberOfColumns}
              renderItem={({ item }) => (
                <PickerItemComponent
                  item={item}
                  label={item.label}
                  onPress={() => {
                    setModalVisible(false);
                    onSelectItem(item);
                  }}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.font_red,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
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
    height: 550
  },
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    borderColor: colors.lightGrey,
    borderWidth: 2,
    flexDirection: "row",
    padding: 8,
    marginVertical: 5,
  },
  icon: {
    marginRight: 10,
  },
  placeholder: {
    color: defaultStyles.colors.grey,
    flex: 1,
  },
  text: {
    flex: 1,
  },
});

export default AppPicker;
