import React, { useState } from "react";
import { StyleSheet, FlatList, Dimensions, ScrollView, View } from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";
import { Component } from "react";

const listings = [
  {
    id: 1,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'red',
    image: require("../assets/appIcon/ingredients.png"),
  },
  {
    id: 2,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'red',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 3,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'red',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 4,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'orange',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 5,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'orange',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 6,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'yellow',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 7,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'yellow',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 8,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'green',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 9,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'green',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 10,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'red',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 11,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'red',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 12,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'red',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 13,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'red',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 14,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'orange',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 15,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'orange',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 16,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'yellow',
    image: require("../assets/couch.jpg"),
  },
  {
    id: 17,
    title: "Red Dude for sale",
    qty: 100,
    exp: 'yellow',
    image: require("../assets/jacket.jpg"),
  },
  {
    id: 18,
    title: "Couch with all kinds of stain",
    qty: 1000,
    exp: 'green',
    image: require("../assets/couch.jpg"),
  },

];

const inventoryFilter = [
  {
    id: 1,
    title: "All",
    select: true
  },
  {
    id: 2,
    title: "Meat",
    select: false
  },
  {
    id: 3,
    title: "Vegetable",
    select: false
  },
  {
    id: 4,
    title: "Snack",
    select: false
  },
  {
    id: 5,
    title: "Condiments",
    select: false
  },
  {
    id: 6,
    title: "Fruit",
    select: false
  },
  {
    id: 7,
    title: "Others",
    select: false
  },

];

const screenWidth = Dimensions.get('window').width;


function IngredientsTab(props) {
    const [ingrFilter, setIngrFilter] = useState(inventoryFilter)
    const toggleOnOff = (item) => {
      let temp = [...ingrFilter]
      temp = temp.map(invFilter => {
        if (item.id === 1 && invFilter.select === true) {
          for (let i = 2; i < temp.length; i++) {
            ingrFilter[i].select === false;
          }
          return {
            id:invFilter.id,
            select: !invFilter.select,
            title: invFilter.title
          }; 
        }
        if (item.id === invFilter.id) return {
          id:invFilter.id,
          select: !invFilter.select,
          title: invFilter.title
        };
        else return invFilter;
      })
      setIngrFilter(temp)
    };
  return (
    <Screen style={styles.screen}>
      <AppText style={{fontSize: 30, color: colors.primary, fontWeight: "bold", marginLeft: screenWidth*0.05 }} >{"My Ingredients"}</AppText>
      <View style={{
          marginLeft: screenWidth*0.05,
          marginRight: screenWidth*0.05
        }} >
        <FlatList 
          data={ingrFilter} 
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <AppButton 
              color = {item.select ? (colors.primary) : (colors.white)}
              textColor = {item.select ? (colors.white) : (colors.primary)}
              onPress={() => toggleOnOff(item)}
              title={item.title}
            />
          )} >
        </FlatList>
      </View>
      <View style={{marginBottom: 85}}>
        <FlatList
          columnWrapperStyle={styles.gridView}
          numColumns={3}
          data={listings}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <SqCard
              title={item.title}
              subTitle={"QTY: " + item.qty}
              image={item.image}
              screenWidth={screenWidth}
              expStatus={item.exp}
            />
          )}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    backgroundColor: colors.light,
  },
  gridView: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  AppButton: {
    borderRadius: 10
  }
});

export default IngredientsTab;
