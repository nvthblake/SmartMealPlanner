import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import colors from "../config/colors";
import ListItemDeleteAction from "../components/lists/ListItemDeleteAction";

function ShoppingItem({ item, pressHandler }) {
  const [checked, setChecked] = useState(false);
  const [style, setStyle] = useState(styles.item);
  const [hidden, setHidden] = useState(styles.hidden);

  return (
    <>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          setChecked(!checked);
          checked === false
            ? setStyle(styles.itemCross)
            : setStyle(styles.item);
          checked === false
            ? setHidden(styles.notHidden)
            : setHidden(styles.hidden);
        }}
      >
        <View style={styles.itemChild}>
          <Checkbox
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
              checked === false
                ? setStyle(styles.itemCross)
                : setStyle(styles.item);
              checked === false
                ? setHidden(styles.notHidden)
                : setHidden(styles.hidden);
            }}
            color={colors.primary}
            uncheckedColor={colors.primary}
          />
          <Text style={style}>{item.name}</Text>
        </View>
        <View style={hidden}>
          <ListItemDeleteAction onPress={() => pressHandler(item)} />
        </View>
      </TouchableOpacity>
      <View style={styles.separator}></View>
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 5,
    marginTop: 10,
    // borderColor: colors.primary,
    // borderRadius: 30,
    borderWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemChild: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    marginLeft: 10,
  },
  itemCross: {
    marginLeft: 10,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
  },
  deleteButton: {
    marginTop: 10,
    width: 25,
    height: 25,
  },
  hidden: {
    opacity: 0,
    height: 0,
  },
  notHidden: {
    alignItems: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: colors.lightGrey,
  },
});

export default ShoppingItem;
