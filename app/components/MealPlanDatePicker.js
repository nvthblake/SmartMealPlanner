import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  FlatList,
  TouchableHighlight,
  Text,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import defaultStyles from "../config/styles";
import AppText from "./AppText";
import Screen from "./Screen";
import PickerItem from "./PickerItem";
import colors from "../config/colors";
import { Picker } from "@react-native-picker/picker";
import Modal from "react-native-modal";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import {CalendarPicker, Calendar} from 'react-native-calendars';

function MealPlanDatePicker({}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [mealDate, setMealDate] = useState('2020-11-28');
  const markedCurDate = {
    [mealDate]: {selected: true, marked: false, selectedColor: colors.primary},
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
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }

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
            <Text style={styles.modalText}>Hello World!</Text>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Hideeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee Modal</Text>
            </TouchableHighlight>
            <Calendar
              style={styles.calendar}
              theme={calendarTheme}
              current={Date()}
              minDate={Date()}
              onDayPress={(day) => {
                setMealDate(day.dateString);
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
      <Button icon="calendar" mode="contained"  onPress={() => {
          console.log('Pressed');
          setModalVisible(true);}}>Add to meal plan
      </Button>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
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
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
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
