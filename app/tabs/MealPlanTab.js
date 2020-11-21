import React, { Component, Fragment, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  FlatList,
  Platform,
  TouchableOpacity,
  Image,
  Linking,
  CircularOverview,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import Modal from "react-native-modal";

// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addMealPlan,
  deleteMealPlan,
  clearMealPlan,
  addFavoriteRecipe,
  deleteFavoriteRecipe,
  clearFavoriteRecipe,
} from "../../actions";

// Components
import LoadingAnimation from "../components/LoadingAnimation";
import Screen from "../components/Screen";
import RecipeCard from "../components/RecipeCard";

// API
import { getRecipes, getRecipeInfoInBulk } from "../api/Spoonacular";

// Misc
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { nFormatter } from "../utils/NumberFormatting";
import { capitalize } from "../utils/TextFormatting"

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const INITIAL_CATEGORIES_STATE = [
  {
    title: "All",
    selected: true,
  },
];

function MealPlanTab(state) {
  // Database data
  const {
    ingredients,
    addMealPlan,
    deleteMealPlan,
    clearRecipe,
    addFavoriteRecipe,
    deleteFavoriteRecipe,
    clearFavoriteRecipe,
  } = state;
  const ingredientsInFridge = ingredients.fridge;
  const recipes = ingredients.recipes;
  const mealPlanner = ingredients.mealPlanner;
  const favoriteRecipes = ingredients.favoriteRecipes;
  const generatingDays = 6;

  // Vars related to calendar
  const curDate = new Date();
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(generatingDays, "days"), // total 2 weeks
    },
  ];
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
  const [chosenRecipe, setChosenRecipe] = useState(null);

  // Utils Functions
  const openURLInDefaultBrowser = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Don't know how to open URI: " + url);
      }
    });
  };

  const getAllNeededIngredientsForRecipe = (recipe) => {
    const result = [];
    recipe.usedIngredients.forEach((usedIngredient) => {
      result.push({
        isMissing: false,
        ingredient: usedIngredient,
      });
    });
    recipe.missedIngredients.forEach((missedIngredient) => {
      result.push({
        isMissing: true,
        ingredient: missedIngredient,
      });
    });
    return result;
  };
  const generateMealPlan = () => {
    const mealPlans = [];

    // no meal plan in database
    if (mealPlanner.length() == 0) {
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
  };

  const getMealPlanOnDate = (date) => {
    const mealPlan = [];

    // const getFavoriteRecipes = () => {
    //     const recipes = []

    //     return recipes;
  };

  const selectedMealPlan = getMealPlanOnDate(curDate);
  // const favoriteRecipes = getFavoriteRecipes();

  const onChange = (e) => {};

  const getRecipesBasedOnFilter = (recipes) => {
    const result = [];
    const selectedCategories = categories
      .filter((category) => category.selected)
      .map((category) => category.title);
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
    setIsLoading(false);
  }, [ingredientsInFridge]);

  const filteredRecipes = getRecipesBasedOnFilter(recipes);
  // const breakfastRecipes = filteredRecipes;
  let breakfastRecipes = filteredRecipes.filter((recipe) => recipe.dishTypes.indexOf("breakfast") > -1);
  const lunchRecipes = filteredRecipes.filter((recipe) => recipe.dishTypes.indexOf("lunch") > -1);
  const dinnerRecipes = filteredRecipes.filter((recipe) => recipe.dishTypes.indexOf("main course") > -1);

  if (breakfastRecipes.length == 0) {
    breakfastRecipes = filteredRecipes.filter((recipe) => recipe.dishTypes.indexOf("salad") > -1);
  }
  const mealPlan = {};
  const maxlength = Math.min(breakfastRecipes.length, lunchRecipes.length, dinnerRecipes.length);
  for (var i = 0; i < maxlength; i++) {
    mealPlan[i] = [
      breakfastRecipes[i],
      lunchRecipes[i],
      dinnerRecipes[i]
    ]
    
  }
  console.log("----- breakfast\n");
  console.log(breakfastRecipes);
  console.log("----- mealPlan\n");
  console.log(mealPlan[0]);

  // const mealPlan = ;
  return (
    <Screen style={styles.screen}>
      {/* Calendar */}
      <CalendarStrip
        scrollable
        calendarAnimation={{ type: "sequence", duration: 30 }}
        daySelectionAnimation={{
          type: "background",
          duration: 200,
          borderWidth: 2,
          highlightColor: colors.secondary,
          borderHighlightColor: "white",
        }}
        style={{ height: 90, paddingTop: 10 }}
        calendarHeaderStyle={{ color: "black" }}
        calendarColor={"white"}
        dateNumberStyle={{ color: "black" }}
        dateNameStyle={{ color: "black" }}
        highlightDateNumberStyle={{ color: colors.primary }}
        highlightDateNameStyle={{ color: colors.primary }}
        disabledDateNameStyle={{ color: "black" }}
        disabledDateNumberStyle={{ color: "black" }}
        datesWhitelist={datesWhitelist}
        // iconLeft={require('./img/left-arrow.png')}
        // iconRight={require('./img/right-arrow.png')}
        iconContainer={{ flex: 0.1 }}
        markedDates={markedCurDate}
      />


      {/* Today's Meal Plan */}
      {isLoading && (
        <View style={{ width: screenWidth, height: screenHeight / 1.5 }}>
          <LoadingAnimation
            show={isLoading}
            label={"Finding the best recipes for you..."}
          />
        </View>
      )}
      {!isLoading && (
        <ScrollView>
          {/* Meal Plan */}
          {breakfastRecipes.length > 0 && (
            <View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  Today’s Meal Plan
                </Text>
              </View>
              <View>
                <FlatList
                  data={mealPlan[0]}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <RecipeCard recipe={mealPlan[0][index]} setChosenRecipeFunc={setChosenRecipe} />
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}

          {/* Favourite */}
          {breakfastRecipes.length > 0 && (
            <View>
              {/* Header */}
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  Favourite
                </Text>
              </View>

              {/* Recipe Cards */}
              <RecipeCard recipe={breakfastRecipes[0]} setChosenRecipeFunc={setChosenRecipe}/>
            </View>
          )}
        </ScrollView>
      )}
      <Modal
        isVisible={!!chosenRecipe}
        coverScreen={true}
        onBackdropPress={() => setChosenRecipe(null)}
        backdropColor={"#F2F5F8"}
        backdropOpacity={0.9}
      >
        <View style={styles.modalCard}>
          {!!chosenRecipe && (
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <View>
                <Image
                  resizeMode={"cover"}
                  source={{ uri: chosenRecipe.image }}
                  style={{
                    width: "100%",
                    marginRight: 14,
                    height: 160,
                    borderRadius: 10,
                    marginRight: 8,
                  }}
                ></Image>
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
                  {chosenRecipe.title}
                </Text>
                {/* <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 8,
                  }}
                >
                  <CircularOverview
                    stat={chosenRecipe.servings.toString()}
                    title={"Servings"}
                    size={Math.floor(screenWidth / 5.5)}
                  />
                  <CircularOverview
                    stat={chosenRecipe.readyInMinutes.toString() + " mins"}
                    title={"Time"}
                    size={Math.floor(screenWidth / 5.5)}
                  />
                  <CircularOverview
                    stat={
                      Math.floor(
                        chosenRecipe.spoonacularScore * 0.05
                      ).toString() + "/5"
                    }
                    title={"Ratings"}
                    size={Math.floor(screenWidth / 5.5)}
                  />
                </View> */}
                <View
                  style={{
                    height: 1,
                    marginHorizontal: 8,
                    backgroundColor: "lightgrey",
                    marginVertical: 12,
                  }}
                ></View>
                <Text
                  style={{
                    marginHorizontal: 8,
                    fontWeight: "500",
                    fontSize: 15,
                  }}
                >
                  Ingredients
                </Text>
                <FlatList
                  data={getAllNeededIngredientsForRecipe(chosenRecipe)}
                  keyExtractor={(ingredient) =>
                    ingredient.ingredient.id.toString() + "-chosen"
                  }
                  renderItem={({ ingredient, index }) => {
                    return (
                      <View>
                        <Text
                          style={{
                            marginHorizontal: 8,
                            color: getAllNeededIngredientsForRecipe(
                              chosenRecipe
                            )[index].isMissing
                              ? "#D76774"
                              : "#4F555E",
                            fontSize: 16,
                            marginVertical: 4,
                          }}
                        >
                          {capitalize(
                            getAllNeededIngredientsForRecipe(chosenRecipe)[
                              index
                            ].ingredient.name
                          )}
                        </Text>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    borderColor: "#3E73FB",
                    width: Math.floor(screenWidth / 4),
                    borderRadius: 8,
                    paddingVertical: 8,
                    borderWidth: 1,
                  }}
                  onPress={() => {
                    setChosenRecipe(null);
                  }}
                >
                  <Text
                    style={{
                      color: "#3E73FB",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#3E73FB",
                    width: Math.floor(screenWidth / 4),
                    borderRadius: 8,
                    paddingVertical: 8,
                  }}
                  onPress={() =>
                    openURLInDefaultBrowser(chosenRecipe.sourceUrl)
                  }
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    See Details
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#FFBE6A",
                    width: Math.floor(screenWidth / 4),
                    borderRadius: 8,
                    paddingVertical: 8,
                  }}
                  // onPress={() =>
                  //   addMissedIngredientsToCard(chosenRecipe.missedIngredients)
                  // }
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    Finish Eating
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
    backgroundColor: colors.background,
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
    elevation: 9,
  },
  recipeTitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#3c3c3c",
    fontWeight: "bold",
  },
  recipeLikes: {
    fontSize: 15,
    marginTop: 3,
    color: "#B3B3B5",
  },
  recipeUsedIngredients: {
    fontSize: 15,
    marginTop: 12,
    color: "#5BCBC5",
  },
  recipeMissingIngredients: {
    fontSize: 15,
    marginTop: 3,
    color: "#D76774",
  },
  recipeCard: {
    marginLeft: 16,
    backgroundColor: "white",
    borderRadius: 20,
    width: screenWidth / 2,
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
  modalCard: {
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
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: screenHeight / 7,
    padding: 12,
  },
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addMealPlan,
      deleteMealPlan,
      clearMealPlan,
      addFavoriteRecipe,
      deleteFavoriteRecipe,
      clearFavoriteRecipe,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(MealPlanTab);
