import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { StyleSheet, FlatList, Dimensions, ScrollView, View } from "react-native";
import { addIngredient } from '../../IngredientsActions';
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";
import { Component } from "react";

const inventoryFilter = [
  {
    id: 1,
    title: "All"
  },
  {
    id: 2,
    title: "Meat"
  },
  {
    id: 3,
    title: "Vegetable"
  },
  {
    id: 4,
    title: "Snack"
  },
  {
    id: 5,
    title: "Condiments"
  },
  {
    id: 6,
    title: "Fruit"
  },
  {
    id: 7,
    title: "Others"
  },

];

const screenWidth = Dimensions.get('window').width;


function onSelect() {
  const [buttonColor, setButtonColor] = useState(colors.medium)
}

function IngredientsTab(props) {
  return (
    <Screen style={styles.screen}>
      <AppText style={{ fontSize: 30, color: colors.primary, fontWeight: "bold", marginLeft: screenWidth * 0.05 }} >{"My Ingredients"}</AppText>
      <View style={{
        marginLeft: screenWidth * 0.05,
        marginRight: screenWidth * 0.05
      }} >
        <FlatList
          data={inventoryFilter}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(listing) => listing.id.toString()}
          renderItem={({ item }) => (
            <AppButton
              title={item.title}
            // onPress={() => } 
            />
          )} >
        </FlatList>
      </View>
      <FlatList
        columnWrapperStyle={styles.gridView}
        numColumns={3}
        data={this.props.ingredients.current}
        keyExtractor={(ingredient) => ingredient.id.toString()}
        renderItem={({ ingredient }) => (
          <SqCard
            title={ingredient.title}
            subTitle={"QTY: " + ingredient.qty}
            image={ingredient.image}
            screenWidth={screenWidth}
            expStatus={ingredient.exp}
          />
        )}
      />
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
