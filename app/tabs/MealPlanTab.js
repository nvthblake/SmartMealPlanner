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
import CustomButton from "../components/CustomButton";

// Redux
import { connect, useSelector } from "react-redux";
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
import MealPlanDatePicker from "../components/MealPlanDatePicker";

// API
import { getRecipes, getRecipeInfoInBulk } from "../api/Spoonacular";

// Misc
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { nFormatter } from "../utils/NumberFormatting";
import { capitalize } from "../utils/TextFormatting";
import { Button } from "react-native-paper";

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
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  const [categories, setCategory] = useState(INITIAL_CATEGORIES_STATE);
  const [chosenRecipe, setChosenRecipe] = useState(null);
  const [numMealPlans, setNumMealPlans] = useState(6);
  const [selectDate, setSelectDate] = useState(curDate);
  const [heartImage, setHeartImage] = useState(null);
  const [selectMealPlan, getMealPlanOnDate] = useState([]);
  const [maxlength, setMaxLength] = useState(0);
  const [mealPlan, setMealPlan] = useState([]);
  const reactiveRecipes = useSelector(tempState => tempState.ingredients);

  useEffect(() => {
    setMealPlan(generateMealPlan())
    getMealPlanOnDate(mealPlan[0])
    if (mealPlan[0] === undefined || mealPlan[0].length === 0) {
      // setIsResultEmpty(true)
    }
    if (mealPlan[0] !== undefined && mealPlan[0].length > 0) {
      setIsLoading(false);
    }
  }, [reactiveRecipes]);


  // add favorite into mealplan
  const addToMealPlan = (date, selection, recipe) => {
    var msDiff = date - new Date().getTime(); //Future date - current date
    var index = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
    let old = mealPlan;
    let meal = {
      "mealType": selection,
      "recipeObj": recipe
    }
    // const mealPushIndex = old[index].map(meal => meal.mealType).lastIndexOf(selection);
    
    old[index].push(meal);
  }
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
    // console.log("date: ", date, curDate);
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
    // console.log(date);
    let d = new Date(date);
    setSelectDate(d);
    var msDiff = new Date(date).getTime() - new Date().getTime(); //Future date - current date
    var index = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;

    console.log("\ndate from today", index);
    console.log("mealPlan: ", Object.keys(mealPlan))
    // console.log("selectMealPlan: ", Object.keys(mealPlan[index]))
    if (mealPlan[index] != undefined) {
      console.log("onDateSelect mealPlan: ", Object.keys(mealPlan[index]));
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

  /** Generate Meal Plan depending on current ingredients
   * max_length: max days that ingredients can afford
   * min_length: 
   * @return {"date_from_today": [
   *     {"mealType": "breakfast", "recipeObj": RecipeObj},
   *     {"mealType": "lunch", "recipeObj": RecipeObj},
   *     {"mealType": "dinner", "recipeObj": RecipeObj},
   * ]}
   */
  const generateMealPlan = () => {
    const filteredRecipes = getRecipesBasedOnFilter(recipes);
    let breakfastType = ["breakfast", "salad", "soup", "sauce", "side dish"];
    let lunchDinnerType = ["main course", "snack", "dinner", "lunch"];

    let breakfastRecipes = [];
    let lunchRecipes = [];
    let dinnerRecipes = [];

    breakfastType.forEach(function (type_name, index) {
      // get recipe from API
      let breakfast = filteredRecipes.filter(
        (recipe) => recipe.dishTypes.indexOf(type_name) > -1
      );

      // add to breakfastRecipes, not repete recipe
      breakfast.forEach(function (recipe) {
        if (breakfastRecipes.some((e) => e.id === recipe.id) == false) {
          breakfastRecipes.push(recipe);
        }
      });
    });

    let allLunchDinner = [];
    lunchDinnerType.forEach(function (type_name, index) {
      let lunchDinner = filteredRecipes.filter(
        (recipe) => recipe.dishTypes.indexOf(type_name) > -1
      );

      // add to breakfastRecipes, not repete recipe
      lunchDinner.forEach(function (recipe) {
        if (allLunchDinner.some((e) => e.id === recipe.id) == false) {
          allLunchDinner.push(recipe);
        }
      });
    });

    // Divide lunch to half
    lunchRecipes = allLunchDinner.slice(0, Math.ceil(allLunchDinner.length / 2));
    dinnerRecipes = allLunchDinner.slice(
      Math.ceil(allLunchDinner.length / 2),
      allLunchDinner.length
    );

    // display
    console.log("\n-----Breakfast: ", breakfastRecipes.length);
    console.log("-----Lunch: ", lunchRecipes.length);
    console.log("-----Dinner: ", dinnerRecipes.length);
    
    let maxlengthNew = Math.max(
      breakfastRecipes.length,
      lunchRecipes.length,
      dinnerRecipes.length
    );
    setMaxLength(maxlengthNew - 1);
    let minlength = Math.min(
      breakfastRecipes.length,
      lunchRecipes.length,
      dinnerRecipes.length
    );

    console.log("-----maxlength", maxlengthNew);
    console.log("-----minlength", minlength);

    let header = ["Breakfast", "Lunch", "Dinner"];
    let mealPlanGenerate = {};
    for (var i = 0; i < maxlengthNew; i++) {
      mealPlanGenerate[i] = [];
      let dishRecipe = [
        breakfastRecipes[i],
        lunchRecipes[i],
        dinnerRecipes[i]
      ]
      dishRecipe.forEach(function (item, index) {
        if (item !== undefined) {
          let meal = {
            "mealType": header[index],
            "recipeObj": item
          };
          mealPlanGenerate[i].push(meal);
        }
        else if (item === undefined && minlength > 0) {
          let dishIndex = minlength - 1;
          let meal = mealPlanGenerate[dishIndex][index];
          mealPlanGenerate[i].push(meal);
        }

      });
    }
    return mealPlanGenerate;
  };

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

  useEffect(() => {
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
        startingDate={curDate}
      />


      {/* Today's Meal Plan */}
      {isLoading && (
        <View style={{ width: screenWidth, height: screenHeight / 1.5 }}>
          <LoadingAnimation
            show={isLoading}
            label={"Curating a healthy meal plan for your week..."}
          />
        </View>
      )}
      {!isLoading && isResultEmpty && (
        <View style={{ width: screenWidth, height: screenHeight / 1.5 }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 17, textAlign: "center" }}>
              {"I can't find any recipes 😢\nTry adding more ingredients"}
            </Text>
          </View>
        </View>
      )}
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
                {/* Horizontal Scroll Bar of Recipe Card */}
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={Object.keys(selectMealPlan)}
                  horizontal={true}
                  // keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ value, index }) => {
                    return (
                      <RecipeCard header={selectMealPlan[index]["mealType"]} recipe={selectMealPlan[index]["recipeObj"]} setChosenRecipeFunc={setChosenRecipe} />
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
              />
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
              <View style={{ flex: 1 }}>
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
                    // console.log(chosenRecipe.loved);
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
                <MealPlanDatePicker recipe={chosenRecipe} addToMealPlan={addToMealPlan}/>
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
                <CustomButton
                  color={colors.primary}
                  title="See Details"
                  height={40}
                  onPress={() =>
                    openURLInDefaultBrowser(chosenRecipe.sourceUrl)
                  }
                ></CustomButton>
                <CustomButton
                  color={colors.medium}
                  textColor={colors.white}
                  title="Back"
                  height={40}
                  onPress={() => {
                    setChosenRecipe(null);
                  }}
                ></CustomButton>
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
