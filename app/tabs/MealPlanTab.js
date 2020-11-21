import React, { Component, useEffect, useState } from "react";
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
  Alert,
  CircularOverview,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import moment from "moment";
import Modal from "react-native-modal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
import { capitalize } from "../utils/TextFormatting";

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

  const curDate = new Date();

  // State vars
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategory] = useState(INITIAL_CATEGORIES_STATE);
  const [chosenRecipe, setChosenRecipe] = useState(null);
  const [numMealPlans, setNumMealPlans] = useState(6);
  const [selectDate, setSelectDate] = useState(curDate);
  const header = ["Breakfast", "Lunch", "Dinner"];
  const [heartImage, setHeartImage] = useState(null);

  // Vars related to calendar
  let datesWhitelist = (num) => {
    return [
      {
        start: moment(),
        end: moment().add(num, "days"), // total 2 weeks
      },
    ];
  };
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

  const getDateHeader = (date) => {
    console.log("date: ", date, curDate);
    var msDateA = Date.UTC(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    var msDateB = Date.UTC(
      curDate.getFullYear(),
      curDate.getMonth() + 1,
      curDate.getDate()
    );
    moment.locale("en");

    if (msDateA == msDateB) {
      return "Today's Meal Plan";
    } else {
      return moment(date).format("MMM D") + " Meal Plan";
    }
  };

  const onDateSelect = (date) => {
    console.log(date);
    let d = new Date(date);
    setSelectDate(d);
    var msDiff = new Date(date).getTime() - new Date().getTime(); //Future date - current date
    var index = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
    console.log(index);
    if (mealPlan[index] != undefined) {
      console.log(Object.keys(mealPlan[index]));
      getMealPlanOnDate(mealPlan[index]);
    }
    return date;
  };

  // Recipes
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

  // Generate meal plan
  let maxlength;
  const generateMealPlan = () => {
    const filteredRecipes = getRecipesBasedOnFilter(recipes);
    let breakfastRecipes = [];
    let lunchRecipes = [];
    let dinnerRecipes = [];

    let breakfast = filteredRecipes.filter(
      (recipe) => recipe.dishTypes.indexOf("breakfast") > -1
    );
    let main_course = filteredRecipes.filter(
      (recipe) => recipe.dishTypes.indexOf("main course") > -1
    );
    let salad = filteredRecipes.filter(
      (recipe) => recipe.dishTypes.indexOf("salad") > -1
    );
    let soup = filteredRecipes.filter(
      (recipe) => recipe.dishTypes.indexOf("soup") > -1
    );
    let sauce = filteredRecipes.filter(
      (recipe) => recipe.dishTypes.indexOf("sauce") > -1
    );

    breakfast.forEach(function (recipe) {
      if (breakfastRecipes.find((e) => e.id === recipe.id) == false) {
        breakfastRecipes.push(recipe);
      }
    });

    salad.forEach(function (recipe) {
      if (breakfastRecipes.some((e) => e.id === recipe.id) == false) {
        breakfastRecipes.push(recipe);
      }
    });
    sauce.forEach(function (recipe) {
      if (breakfastRecipes.some((e) => e.id === recipe.id) == false) {
        breakfastRecipes.push(recipe);
      }
    });
    soup.forEach(function (recipe) {
      if (breakfastRecipes.some((e) => e.id === recipe.id) == false) {
        breakfastRecipes.push(recipe);
      }
    });

    console.log("------main_course");
    console.log(Object.keys(main_course));

    lunchRecipes = main_course.slice(0, Math.ceil(main_course.length / 2));
    dinnerRecipes = main_course.slice(
      Math.ceil(main_course.length / 2),
      main_course.length
    );

    console.log("------breakfastRecipes");
    console.log(Object.keys(breakfastRecipes));
    console.log("------lunchRecipes");
    console.log(Object.keys(lunchRecipes));
    console.log("------dinnerRecipes");
    console.log(Object.keys(dinnerRecipes));

    let mealPlan = {};
    maxlength = Math.max(
      breakfastRecipes.length,
      lunchRecipes.length,
      dinnerRecipes.length
    );
    const minlength = Math.min(
      breakfastRecipes.length,
      lunchRecipes.length,
      dinnerRecipes.length
    );

    console.log("-----maxlength");
    console.log(maxlength);
    console.log("-----minlength");
    console.log(minlength);

    console.log("here", Math.ceil(main_course.length / 2));
    console.log("here", Math.floor(main_course.length / 2));
    for (var i = 0; i < maxlength; i++) {
      let b = breakfastRecipes[i];
      let l = lunchRecipes[i];
      let d = dinnerRecipes[i];

      if (b === undefined && minlength != 0) {
        b = breakfastRecipes[minlength - 1];
      }
      if (l === undefined && minlength != 0) {
        l = lunchRecipes[minlength - 1];
      }
      if (d === undefined && minlength != 0) {
        d = dinnerRecipes[minlength - 1];
      }
      mealPlan[i] = [b, l, d];
    }
    return mealPlan;
  };
  let mealPlan = generateMealPlan();
  const [selectMealPlan, getMealPlanOnDate] = useState(mealPlan[0]);

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
  const handleDelete = (recipe) => {
    Alert.alert(
      "Done Eating?",
      "This recipe will be removed from your meal planner",
      [
        {
          text: "Yes",
          onPress: () => {
            console.log(recipe);
            // Delete from reduce
            deleteMealPlan(recipe);
          },
        },
        {
          text: "No",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    setIsLoading(false);
    setNumMealPlans(maxlength);
    getMealPlanOnDate(mealPlan[0]);
    onDateSelect(curDate);
  }, [ingredientsInFridge]);

  useEffect(() => {
    setNumMealPlans(maxlength);
  }, [maxlength]);

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
        style={{ height: 90, paddingTop: 10, marginBottom: 10 }}
        calendarHeaderStyle={{ color: "black" }}
        calendarColor={"white"}
        dateNumberStyle={{ color: "black" }}
        dateNameStyle={{ color: "black" }}
        highlightDateNumberStyle={{ color: colors.primary }}
        highlightDateNameStyle={{ color: colors.primary }}
        disabledDateNameStyle={{ color: "black" }}
        disabledDateNumberStyle={{ color: "black" }}
        datesWhitelist={datesWhitelist(numMealPlans)}
        iconContainer={{ flex: 0.1 }}
        markedDates={markedCurDate}
        onDateSelected={onDateSelect}
        selectedDate={curDate}
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
          {selectMealPlan !== undefined && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  {getDateHeader(selectDate)}
                </Text>
              </View>
              <View>
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={selectMealPlan}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <RecipeCard
                        header={header[index]}
                        recipe={selectMealPlan[index]}
                        setChosenRecipeFunc={setChosenRecipe}
                      />
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}

          {/* Favorite section */}
          {favoriteRecipes.length > 0 && (
            <View>
              {/* Header */}
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 22, fontWeight: "bold" }}>
                  Favourite
                </Text>
              </View>

              {/* Recipe Cards */}
              <FlatList
                style={styles.recipeScroll}
                data={favoriteRecipes}
                horizontal={true}
                keyExtractor={(recipe) => recipe.id.toString()}
                renderItem={({ recipe, index }) => {
                  return (
                    <RecipeCard
                      recipe={favoriteRecipes[index]}
                      setChosenRecipeFunc={setChosenRecipe}
                    />
                  );
                }}
              ></FlatList>
              {/* <RecipeCard recipe={favoriteRecipes[0]} setChosenRecipeFunc={setChosenRecipe}/> */}
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
                <TouchableOpacity
                  onPress={() => {
                    chosenRecipe.loved = !chosenRecipe.loved;
                    console.log(chosenRecipe.loved);
                    chosenRecipe.loved
                      ? setHeartImage("heart")
                      : setHeartImage("heart-outline");
                    chosenRecipe.loved
                      ? addFavoriteRecipe(chosenRecipe)
                      : deleteFavoriteRecipe(chosenRecipe);
                  }}
                  style={{ position: "absolute" }}
                >
                  <MaterialCommunityIcons
                    name={chosenRecipe.loved ? "heart" : "heart-outline"}
                    size={40}
                    color={colors.font_red}
                  />
                </TouchableOpacity>
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
                    Back
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
                  onPress={() => handleDelete(chosenRecipe)}
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
    // flex: 1,
  },
  body: {
    flex: 1,
  },
  sectionHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
  recipeScroll: {
    marginLeft: 6,
    height: 240,
    paddingBottom: 20,
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
    // marginTop: screenHeight / 7,
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
