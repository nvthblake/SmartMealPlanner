import React, { Component, Fragment, useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, SafeAreaView } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addMealPlan, deleteMealPlan, clearMealPlan,
  addFavoriteRecipe, deleteFavoriteRecipe, clearFavoriteRecipe
} from "../../actions";

// Components
import LoadingAnimation from '../components/LoadingAnimation';
import Screen from "../components/Screen";

// API
import { getRecipes, getRecipeInfoInBulk } from '../api/Spoonacular';

// Misc
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const INITIAL_CATEGORIES_STATE = [
  {
    title: "All",
    selected: true
  }
];


function MealPlanTab(state) {
  // Database data
  const {
    ingredients,
    addMealPlan, deleteMealPlan, clearRecipe,
    addFavoriteRecipe, deleteFavoriteRecipe, clearFavoriteRecipe
  } = state;
  const ingredientsInFridge = ingredients.fridge;
  const recipes = ingredients.recipes;
  const mealPlanner = ingredients.mealPlanner;
  const favoriteRecipes = ingredients.favoriteRecipes;

  // Vars related to calendar
  const curDate = new Date();
  let datesWhitelist = [{
    start: moment(),
    end: moment().add(13, 'days')  // total 2 weeks
  }];
  const markedCurDate = [
    {
      date: curDate,
      dots: [
        {
          color: colors.primary,
        },
      ],
    },
  ];

  // State vars
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategory] = useState(INITIAL_CATEGORIES_STATE);
  const numMealPlans = 14;

  const generateMealPlan = () => {
    const mealPlans = [];

    // no meal plan in database
    if (mealPlanner.length() == 0) {
      ;
    }
    // meal plans in database is < numDay 
    else if (mealPlanner.length() < numMealPlans) {
      const neededNumMealPlan = numMealPlans - mealPlanner.length();

    }
    // meal plan > numdate
    else {
      const neededNumMealPlan = numMealPlans - mealPlanner.length();

    }

    return mealPlans;
  }

  const getMealPlanOnDate = (date) => {
    const mealPlan = [];

    // const getFavoriteRecipes = () => {
    //     const recipes = []

    //     return recipes;
  }

  const selectedMealPlan = getMealPlanOnDate(curDate);
  // const favoriteRecipes = getFavoriteRecipes();

  const onChange = (e) => {

  }

  const getRecipesBasedOnFilter = (recipes) => {
    const result = [];
    const selectedCategories = categories.filter((category => category.selected)).map((category) => category.title);
    if (selectedCategories.indexOf("All") > -1) {
      return recipes;
    }
    for (let i = 0; i < recipes.length; i++) {
      for (let j = 0; j < selectedCategories.length; j++) {
        if (recipes[i].dishTypes.indexOf(selectedCategories[j]) > -1) {
          result.push(recipes[i]);
          break;
        }
      }
    }
    return result;
  };

  useEffect(() => {
    getRecipes(ingredientsInFridge, numMealPlans).then((step1_recipes) => {
      getRecipeInfoInBulk(step1_recipes).then((final_recipes) => {
        final_recipes.sort((a, b) => {
          return b.likes - a.likes;
        });
        clearRecipe();

        let allDishTypes = [];
        final_recipes.forEach(recipe => {
          addRecipe(recipe);
          recipe.dishTypes.forEach(dishType => {
            allDishTypes.push(dishType);
          });
        });
        resetCategories();
        allDishTypes = Array.from(new Set(allDishTypes));
        console.log("RecipeTab -> allDishTypes", allDishTypes)
        addCategories(allDishTypes);
        console.log("RecipeTab -> recipes", recipes.length)
        setIsLoading(false);
      });
    });
  })

  const filteredRecipes = getRecipesBasedOnFilter(recipes);
  const breakfastRecipes = filteredRecipes.filter((recipe) => recipe.dishType === 'breakfast');

  return (
      <Screen style={styles.screen}>
        {/* Calendar */}
          <CalendarStrip
            calendarAnimation={{ type: 'sequence', duration: 30 }}
            daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 2, borderHighlightColor: 'white' }}
            style={{ height: 100, paddingTop: 10 }}
            calendarHeaderStyle={colors.primary}
            calendarColor={colors.white}
            dateNumberStyle={{ color: 'black' }}
            dateNameStyle={{ color: 'black' }}
            highlightDateNumberStyle={{ color: colors.primary }}
            highlightDateNameStyle={{ color: colors.primary }}
            disabledDateNameStyle={{ color: 'black' }}
            disabledDateNumberStyle={{ color: 'black' }}
            datesWhitelist={datesWhitelist}
            // iconLeft={require('./img/left-arrow.png')}
            // iconRight={require('./img/right-arrow.png')}
            iconContainer={{ flex: 0.1 }}
            markedDates={markedCurDate}
          />

        {/* Meal Plan */}
        {isLoading && <View style={{ width: screenWidth, height: screenHeight / 1.5 }}><LoadingAnimation show={isLoading} label={'Finding the best recipes for you...'} /></View>}
        {!isLoading &&
          <ScrollView>
            {breakfastRecipes.length > 0 &&
              <View>
                <View style={{ padding: 16 }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Very Popular</Text>
                </View>
                <View>
                  <FlatList
                    data={breakfastRecipes}
                    horizontal={true}
                    keyExtractor={(recipe) => recipe.id.toString()}
                    renderItem={({ recipe, index }) => {
                      return (
                        <View style={{ paddingBottom: 5 }}>
                          <View style={styles.recipeCard}>
                            <TouchableOpacity onPress={() => openURLInDefaultBrowser(breakfastRecipes[index].sourceUrl)}>
                              <View style={{ padding: 10 }}>
                                <View style={{ flexDirection: 'column' }}>
                                  <Image source={{ uri: breakfastRecipes[index].image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                  <Text numberOfLines={2} style={styles.recipeTitle}>{breakfastRecipes[index].title}</Text>
                                  <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(breakfastRecipes[index].likes, 1)} likes</Text>
                                  <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{breakfastRecipes[index].usedIngredients.length} ingredients</Text>
                                  <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{breakfastRecipes[index].missedIngredients.length} missings</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      )
                    }}>
                  </FlatList>
                </View>
              </View>}
          </ScrollView>
        }
      </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  calendar: {
    margin: 20,
    borderRadius: 20,
  },
  shadowBox: {
    // shadow
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 9
  },
  title: {
    // fontStyle: 'Avenir',
    textAlign: 'center', // <-- the magic
    fontWeight: 'bold',
    fontSize: 28,
    color: colors.font_dark
  }
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addMealPlan, deleteMealPlan, clearMealPlan,
      addFavoriteRecipe, deleteFavoriteRecipe, clearFavoriteRecipe
    },
    dispatch
  );


export default connect(mapStateToProps, mapDispatchToProps)(MealPlanTab);
