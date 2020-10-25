import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";

import Screen from "../components/Screen";
import SqCard from "../components/SqCard";
import colors from "../config/colors";
import { Component } from "react";

import { addRecipe, clearRecipe } from "../../actions";
import Icon from "react-native-vector-icons/MaterialIcons";
import RecipeCard from "../components/RecipeCard";
import { render } from "react-dom";
import Recipe from "../models/Recipe";
import SpoonacularIngredient from "../models/SpoonacularIngredient";
// import styles from "../config/styles";

class RecipeTab extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const params = this.props.ingredients.fridge
      .map((ingredient) => ingredient.ingredient.replace(" ", "%20"))
      .join("%2C");
    // alert(params)
    return fetch(
      `https://rapidapi.p.rapidapi.com/recipes/findByIngredients?ingredients=${params}&number=10&ranking=1&ignorePantry=true`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          "x-rapidapi-key":
            "895ce719e4mshcb836fa18684a5ap1c69f2jsnf7e37492c80d",
        },
      }
    )
      .then((response) => response.json())
      .then((responseJson) => {
        this.props.clearRecipe();
        responseJson.forEach((recipeJson) => {
          const missedIngredients = recipeJson.missedIngredients.map(
            (missedIngredient) => {
              const newMissedIng = new SpoonacularIngredient(
                missedIngredient.aisle,
                missedIngredient.amount,
                missedIngredient.id,
                missedIngredient.image,
                missedIngredient.meta,
                missedIngredient.metaInformation,
                missedIngredient.name,
                missedIngredient.original,
                missedIngredient.originalName,
                missedIngredient.originalString,
                missedIngredient.unit,
                missedIngredient.unitLong,
                missedIngredient.unitShort
              );
              return newMissedIng;
            }
          );
          const unusedIngredients = recipeJson.unusedIngredients.map(
            (unusedIngredient) => {
              const newUnusedIng = new SpoonacularIngredient(
                unusedIngredient.aisle,
                unusedIngredient.amount,
                unusedIngredient.id,
                unusedIngredient.image,
                unusedIngredient.meta,
                unusedIngredient.metaInformation,
                unusedIngredient.name,
                unusedIngredient.original,
                unusedIngredient.originalName,
                unusedIngredient.originalString,
                unusedIngredient.unit,
                unusedIngredient.unitLong,
                unusedIngredient.unitShort
              );
              return newUnusedIng;
            }
          );
          const usedIngredients = recipeJson.usedIngredients.map(
            (usedIngredient) => {
              const newUsedIng = new SpoonacularIngredient(
                usedIngredient.aisle,
                usedIngredient.amount,
                usedIngredient.id,
                usedIngredient.image,
                usedIngredient.meta,
                usedIngredient.metaInformation,
                usedIngredient.name,
                usedIngredient.original,
                usedIngredient.originalName,
                usedIngredient.originalString,
                usedIngredient.unit,
                usedIngredient.unitLong,
                usedIngredient.unitShort
              );
              return newUsedIng;
            }
          );
          const newRecipe = new Recipe(
            recipeJson.id,
            recipeJson.image,
            recipeJson.imageType,
            recipeJson.likes,
            recipeJson.missedIngredientCount,
            missedIngredients,
            recipeJson.title,
            unusedIngredients,
            recipeJson.usedIngredientCount,
            usedIngredients
          );
          this.props.addRecipe(newRecipe);
        });
      })
      .catch((err) => {
        // console.log("RecipeTab -> componentDidMount -> err", err);
        alert("Out of Spoonacular usage lol!");
      });
  }

  render() {
    return (
      <Screen style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.navBar}>
            <Image
              source={require("../assets/appIcon/fridge.png")}
              style={{ width: 50, height: 50 }}
            />
            <View style={styles.rightNav}>
              <TouchableOpacity>
                <Icon style={styles.navItem} name="search" size={25} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon style={styles.navItem} name="account-circle" size={25} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.body}>
            <FlatList
              data={this.props.ingredients.recipes}
              renderItem={(recipe) => <RecipeCard recipe={recipe.item} />}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View
                  style={{ height: 0.5, backgroundColor: "#E5E5E5" }}
                ></View>
              )}
            />
          </View>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 8,
    backgroundColor: colors.light,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  navBar: {
    height: 55,
    backgroundColor: "white",
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightNav: {
    flexDirection: "row",
  },
  navItem: {
    marginLeft: 25,
  },
  body: {
    flex: 1,
  },
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addRecipe,
      clearRecipe,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecipeTab);
