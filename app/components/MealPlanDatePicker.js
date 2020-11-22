import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
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
import CustomButton from "./CustomButton";
import AppButton from "./AppButton";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function MealPlanDatePicker({ recipe, addToMealPlan }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [optionVisible, setOptionVisible] = useState(false);
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [mealDate, setMealDate] = useState("2020-11-23");
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
    textDayFontWeight: "100",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "100",
    textDayFontSize: 14,
    textMonthFontSize: 14,
    textDayHeaderFontSize: 14,
  };
  const [daypicked, setDayPicked] = useState(tomorrow);
  const [mealTypes, setMealTypes] = useState(pickerOptions.mealtype);
  const [mealTypeSelected, setMealTypeSelected] = useState(pickerOptions.mealtype[0]);
  const toggleMealType = (item) => {
    let temp = [...mealTypes];
    for (let i = 0; i < temp.length; i++) {
      i === item.id ? temp[i].select = true : temp[i].select = false;
    }
    setMealTypes(temp);
    setMealTypeSelected(item.label);
  };

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
              {/* <TouchableHighlight
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>CANCEL</Text>
              </TouchableHighlight> */}
              <Text
                style={{
                  color: "#4F555E",
                  fontSize: 20,
                  paddingHorizontal: 8,
                  fontWeight: "600",
                  paddingVertical: 12,
                  textAlign: "center",
                }}
              >
                {recipe.title}
              </Text>
              <Calendar
                style={styles.calendar}
                theme={calendarTheme}
                current={new Date()}
                minDate={new Date()}
                onDayPress={(day) => {
                  setMealDate(day.dateString);
                  setDayPicked(day);
                  // setOptionVisible(true);
                }}
                hideExtraDays={true}
                disableMonthChange={true}
                firstDay={1}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
                markedDates={markedCurDate}
              />
              <View style={[styles.buttonContainer, {justifyContent: "center", marginHorizontal: 8}]}>
                <FlatList
                  data={pickerOptions.mealtype}
                  horizontal
                  scrollEnabled={false}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(listing) => listing.label}
                  renderItem={({ item }) => (
                    <AppButton
                      color={item.select ? item.colorCode : colors.white}
                      borderColor={item.colorCode}
                      // borderColor={item.select ? item.colorCode : colors.grey}
                      textColor={item.select ? colors.white : item.colorCode}
                      onPress={() => toggleMealType(item)}
                      title={item.buttonLabel}
                      width={(screenWidth-90)/3}
                    />
                  )}
                ></FlatList>
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  title="ADD TO MEAL PLAN"
                  onPress={() => {
                    addToMealPlan(
                      daypicked.timestamp,
                      mealTypeSelected,
                      recipe
                    );
                    setModalVisible(!modalVisible);}}
                  color={colors.primary}
                  textColor={colors.white}
                />
                <CustomButton
                  title="BACK"
                  onPress={() => setModalVisible(!modalVisible)}
                  color={colors.grey}
                  textColor={colors.white}
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
  buttonContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
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
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    width: 300,
  },
});

export default MealPlanDatePicker;
