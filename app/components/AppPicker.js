import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableHighlight,
  Text,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import PickerItem from "./PickerItem";
import colors from "../config/colors";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";

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
            styles.pickerContainer,
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
      <Modal
        backdropColor={"#F2F5F8"}
        backdropOpacity={0.5}
        coverScreen={true}
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableHighlight
              style={styles.button}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.textStyle}>CLOSE</Text>
            </TouchableHighlight>
            <View style={styles.scrollContainer}>
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
    backgroundColor: colors.danger,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 200,
  },
  centeredView: {
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
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  scrollContainer: {
    height: 300,
    width: 200,
  },
  pickerContainer: {
    backgroundColor: defaultStyles.colors.white,
    borderRadius: 25,
    borderColor: colors.secondary,
    borderWidth: 2,
    flexDirection: "row",
    height: 50,
    alignItems: "center",
    paddingHorizontal: 8,
    // padding: 8,
    marginVertical: 4,
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
