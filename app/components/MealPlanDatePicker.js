import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import PickerItem from "./PickerItem";
import colors from "../config/colors";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { CalendarPicker, Calendar } from "react-native-calendars";
import pickerOptions from "../config/pickerOptions";
import CustomButton from "../components/CustomButton";

function MealPlanDatePicker({ recipe, addToMealPlan }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [optionVisible, setOptionVisible] = useState(false);
  const [mealDate, setMealDate] = useState(Date());
  const markedCurDate = {
    [mealDate]: {
      selected: true,
      marked: false,
      selectedColor: colors.primary,
    },
  };
  const calendarTheme = {
    textSectionTitleColor: colors.primary,
    textSectionTitleDisabledColor: colors.grey,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: colors.white,
    todayTextColor: colors.grey,
    dayTextColor: colors.grey,
    textDisabledColor: colors.lightGrey,
    arrowColor: colors.primary,
    disabledArrowColor: colors.lightGrey,
    monthTextColor: colors.primary,
    indicatorColor: colors.primary,
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  };
  const [daypicked, setDayPicked] = useState(new Date());
  return (
    <>
      <View style={styles.centeredView}>
        <Modal
          backdropColor={"#F2F5F8"}
          backdropOpacity={0.8}
          coverScreen={true}
          isVisible={modalVisible}
          animationType="slide"
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>CANCEL</Text>
              </TouchableHighlight>
              <Calendar
                style={styles.calendar}
                theme={calendarTheme}
                current={new Date()}
                minDate={new Date()}
                onDayPress={(day) => {
                  setMealDate(day.dateString);
                  setDayPicked(day);
                  setOptionVisible(true);
                }}
                hideExtraDays={true}
                disableMonthChange={true}
                firstDay={1}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
                markedDates={markedCurDate}
              />
            </View>
          </View>
        </Modal>
        <Modal
          backdropColor={"#F2F5F8"}
          backdropOpacity={0.5}
          coverScreen={true}
          isVisible={optionVisible}
          onBackdropPress={() => setOptionVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                style={styles.cancelButton}
                onPress={() => {
                  setOptionVisible(!optionVisible);
                }}
              >
                <Text style={styles.textStyle}>CANCEL</Text>
              </TouchableHighlight>
              <View style={styles.scrollContainer}>
                <FlatList
                  data={pickerOptions.mealtype}
                  numColumns={1}
                  renderItem={({ item }) => (
                    <PickerItem
                      item={item}
                      label={item.label}
                      onPress={() => {
                        setOptionVisible(false);
                        addToMealPlan(
                          daypicked.timestamp,
                          item.label.toString(),
                          recipe
                        );
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Button
          icon="calendar"
          mode="contained"
          onPress={() => {
            console.log("Pressed");
            setModalVisible(true);
          }}
          style={styles.button}
        >
          Add to meal plan
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    padding: 10,
    elevation: 2,
  },
  scrollContainer: {
    height: 200,
    width: 200,
  },
  cancelButton: {
    backgroundColor: colors.font_red,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
  },
  textStyle: {
    flex: 1,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 40,
  },
  centeredView: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  calendar: {
    padding: 8,
    margin: 25,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 9,
  },
});

export default MealPlanDatePicker;
