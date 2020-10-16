import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
  View,
  Text
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";
import { Component } from "react";

import { addIngredient } from '../../IngredientsActions';

const inventoryFilter = [
  {
    id: 1,
    title: "All",
    select: true,
  },
  {
    id: 2,
    title: "Meat",
    select: false,
  },
  {
    id: 3,
    title: "Vegetable",
    select: false,
  },
  {
    id: 4,
    title: "Snack",
    select: false,
  },
  {
    id: 5,
    title: "Condiments",
    select: false,
  },
  {
    id: 6,
    title: "Fruit",
    select: false,
  },
  {
    id: 7,
    title: "Others",
    select: false,
  },
];

const screenWidth = Dimensions.get("window").width;

function IngredientsTab(state) {
  const { ingredients } = state;
  const availableIngredients = ingredients.current;
  
  const [ingrFilter, setIngrFilter] = useState(inventoryFilter);
  const toggleOnOff = (item) => {
    let temp = [...ingrFilter];
    temp = temp.map((invFilter) => {
      if (item.id === 1 && invFilter.select === true) {
        for (let i = 2; i < temp.length; i++) {
          ingrFilter[i].select === false;
        }
        return {
          id: invFilter.id,
          select: !invFilter.select,
          title: invFilter.title,
        };
      }
      if (item.id === invFilter.id)
        return {
          id: invFilter.id,
          select: !invFilter.select,
          title: invFilter.title,
        };
      else return invFilter;
    });
    setIngrFilter(temp);
  };
  return (
    <Screen style={styles.screen}>
      <AppText
        style={{
          fontSize: 30,
          color: colors.primary,
          fontWeight: "bold",
          marginLeft: screenWidth * 0.05,
        }}
      >
        {"My Ingredients"}
      </AppText>
      <View
        style={{
          marginLeft: screenWidth * 0.05,
          marginRight: screenWidth * 0.05,
        }}
      >
        <FlatList
          data={ingrFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <AppButton
              color={item.select ? colors.primary : colors.white}
              textColor={item.select ? colors.white : colors.primary}
              onPress={() => toggleOnOff(item)}
              title={item.title}
            />
          )}
        ></FlatList>
      </View>
      <View style={{ marginBottom: 85 }}>
        <FlatList
          columnWrapperStyle={styles.gridView}
          numColumns={3}
          data={availableIngredients}
          keyExtractor={(ingredient) => ingredient.id.toString()}
          renderItem={({ ingredient, index }) => {
            return (
              <SqCard
                title={availableIngredients[index].title}
                subTitle={"QTY: " + availableIngredients[index].qty}
                image={availableIngredients[index].image}
                screenWidth={screenWidth}
                expStatus={availableIngredients[index].exp}
              />
            )
          }}
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
    borderRadius: 10,
  },
});

const mapStateToProps = (state) => {
  const { ingredients } = state
  return { ingredients }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addIngredient,
  }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(IngredientsTab);
