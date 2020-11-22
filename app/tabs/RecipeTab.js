/* React */
import React, { useEffect, useState, Component } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  Dimensions,
  Text,
  Platform,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { render } from "react-dom";

/* Custom components */
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import LoadingAnimation from "../components/LoadingAnimation";
import CircularOverview from "../components/CircularOverview";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* Models */
import Recipe from "../models/Recipe";
import SpoonacularIngredient from "../models/SpoonacularIngredient";

/* Redux */ import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  addRecipe,
  clearRecipe,
  addIngredientToCart,
  addFavoriteRecipe,
  deleteFavoriteRecipe,
} from "../../actions";

/* APIs */
import { getRecipes, getRecipeInfoInBulk } from "../api/Spoonacular";

/* 3rd party */
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";

/* Miscellaneous */
import colors from "../config/colors";
import { nFormatter } from "../utils/NumberFormatting";
import { capitalize } from "../utils/TextFormatting";
import CustomButton from "../components/CustomButton";
// Database imports
import { openDatabase } from "expo-sqlite";

const db = openDatabase("db2.db");

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const INITIAL_CATEGORIES_STATE = [
  {
    title: "All",
    selected: true,
  },
];

function RecipeTab(state) {
  const {
    ingredients,
    addRecipe,
    clearRecipe,
    addIngredientToCart,
    addFavoriteRecipe,
    deleteFavoriteRecipe,
  } = state;

  const ingredientsInFridge = ingredients.fridge;
  const recipes = ingredients.recipes;

  const [categories, setCategory] = useState(INITIAL_CATEGORIES_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  const [chosenRecipe, setChosenRecipe] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [love, setLove] = useState(false);
  const [heartImage, setHeartImage] = useState(null);
  const [search, setSearch] = useState("");

  const resetCategories = () => {
    setCategory(INITIAL_CATEGORIES_STATE);
  };

  const addCategories = (categoryNames) => {
    let new_categories_state = [...categories];
    const currentCategories = new_categories_state.map(
      (category) => category.title
    );
    categoryNames.forEach((categoryName) => {
      if (currentCategories.indexOf(categoryName) < 0) {
        new_categories_state.push({
          title: categoryName,
          selected: false,
        });
      }
    });
    setCategory(new_categories_state);
  };

  const toggleCategory = (selectedCategory) => {
    console.log("toggleCategory -> selectedCategory", selectedCategory);
    let new_categories_state = [...categories];

    if (selectedCategory.title === "All") {
      new_categories_state = new_categories_state.map((old_category_state) => {
        console.log(
          "toggleCategory -> old_category_state",
          old_category_state.title
        );
        if (old_category_state.title === "All") {
          return {
            selected: true,
            title: old_category_state.title,
          };
        } else {
          return {
            selected: false,
            title: old_category_state.title,
          };
        }
      });
    } else {
      new_categories_state[0].selected = false;
      new_categories_state = new_categories_state.map((old_category_state) => {
        if (selectedCategory.title === old_category_state.title) {
          return {
            selected: !old_category_state.selected,
            title: old_category_state.title,
          };
        } else {
          return {
            selected: old_category_state.selected,
            title: old_category_state.title,
          };
        }
      });
    }
    console.log("toggleCategory -> new_categories_state", new_categories_state);
    setCategory(new_categories_state);
  };

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

  const addMissedIngredientsToCard = (missedIngredients) => {
    console.log(
      "addMissedIngredientsToCard -> missedIngredients",
      missedIngredients
    );
    missedIngredients.forEach((missedIngredient) => {
      addIngredientToCart({ name: missedIngredient.name, id: missedIngredient.id, checked: false });
      console.log("missed ingredient is", missedIngredient.name, missedIngredient.id);
      db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO ShoppingList (name, id, checked) values (?, ?, ?)`,
          [missedIngredient.name, missedIngredient.id.toString(), 0],
          () => {console.log("Inserted to SQLite ", missedIngredient.name, missedIngredient.id.toString())},
          (_, error) =>
              console.log("RecipeTab addMissedIngredientsToCard SQLite -> ", error)
        )
      });
    });

    Alert.alert(
      `Success`,
      `Added ${missedIngredients.length} items to your shopping list 🤩`,
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadRecipesFromSpoonacular()
      .then((recipes) => {
        setRefreshing(false);
      })
      .catch((err) => {
        setRefreshing(false);
      });
  };

  function loadRecipesFromSpoonacular() {
    return new Promise((resolve, reject) => {
      getRecipes(ingredientsInFridge, 30)
        .then((step1_recipes) => {
          if (step1_recipes.length === 0) {
            setIsResultEmpty(true);
            setIsLoading(false);
            return;
          }

          getRecipeInfoInBulk(step1_recipes)
            .then((final_recipes) => {
              if (final_recipes.length === 0) {
                setIsResultEmpty(true);
                setIsLoading(false);
                return;
              }

              final_recipes.sort((a, b) => {
                return b.likes - a.likes;
              });
              clearRecipe();

              let allDishTypes = [];
              final_recipes.forEach((recipe) => {
                addRecipe(recipe);
                recipe.dishTypes.forEach((dishType) => {
                  allDishTypes.push(dishType);
                });
              });
              resetCategories();
              allDishTypes = Array.from(new Set(allDishTypes));
              console.log("RecipeTab -> allDishTypes", allDishTypes);
              addCategories(allDishTypes);
              console.log("RecipeTab -> recipes", recipes.length);
              setIsLoading(false);

              resolve(final_recipes);
            })
            .catch((err) => {
              setIsResultEmpty(true);
              setIsLoading(false);
              reject(err);
            });
        })
        .catch((err) => {
          setIsResultEmpty(true);
          setIsLoading(false);
          reject(err);
        });
    });
  }

  const updateSearch = (search) => {
    this.setState({ search });
  };

  // Initial API pull
  useEffect(() => {
    loadRecipesFromSpoonacular();
  }, []);

  const filteredRecipes = getRecipesBasedOnFilter(recipes);
  const veryPopularRecipes = filteredRecipes.filter(
    (recipe) => recipe.veryPopular
  );
  const veryHealthyRecipes = filteredRecipes.filter(
    (recipe) => recipe.veryHealthy
  );
  const vegetarianRecipes = filteredRecipes.filter(
    (recipe) => recipe.vegetarian
  );
  const otherRecipes = filteredRecipes.filter(
    (recipe) => !recipe.vegetarian && !recipe.veryPopular && !recipe.veryHealthy
  );

  return (
    <Screen style={styles.screen}>
      {/* Search Bar engine */}
      <SearchBar
        round
        platform={Platform.OS}
        containerStyle={styles.searchBar}
        inputContainerStyle={styles.inputSearchBar}
        placeholder="Search recipes..."
        onChangeText={updateSearch}
        value={search}
      />

      {/* Filters Scroll Horizontal */}
      <View
        style={{
          marginLeft: screenWidth * 0.05,
          marginRight: screenWidth * 0.05,
        }}
      >
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(category) => category.title}
          renderItem={({ category, index }) => (
            <AppButton
              color={categories[index].selected ? colors.primary : colors.white}
              textColor={
                categories[index].selected ? colors.white : colors.primary
              }
              onPress={() => toggleCategory(categories[index])}
              title={capitalize(categories[index].title)}
            />
          )}
        ></FlatList>
      </View>

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
                  style={styles.imageHolder}
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
                <View
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
                </View>
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
                    marginBottom: 2,
                    fontWeight: "500",
                    fontSize: 17,
                  }}
                >
                  Ingredients
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
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
                          {getAllNeededIngredientsForRecipe(chosenRecipe)[index]
                            .ingredient.amount +
                            " " +
                            getAllNeededIngredientsForRecipe(chosenRecipe)[
                              index
                            ].ingredient.unitShort +
                            " " +
                            capitalize(
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
                style={{ position: "absolute", padding: 5 }}
              >
                <MaterialCommunityIcons
                  name={chosenRecipe.loved ? "heart" : "heart-outline"}
                  size={40}
                  color={chosenRecipe.loved ? colors.font_red : colors.white}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CustomButton
                  color={"#FFBE6A"}
                  title="Add to  🛒"
                  height={40}
                  onPress={() =>
                    addMissedIngredientsToCard(chosenRecipe.missedIngredients)
                  }
                ></CustomButton>
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
                    setHeartImage(null);
                  }}
                ></CustomButton>
              </View>
            </View>
          )}
        </View>
      </Modal>
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

      {/* Starting Displaying recipe section */}
      {!isLoading && (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Very Popular Recipes Section */}
          {veryPopularRecipes.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                  Very Popular
                </Text>
              </View>
              <View>
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={veryPopularRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity
                            onPress={() => {
                              console.log(veryPopularRecipes[index]);
                              setChosenRecipe(veryPopularRecipes[index]);
                            }}
                          >
                            <View style={{ padding: 9 }}>
                              <View style={{ flexDirection: "column", height: '100%', minHeight: 240 }}>
                                <Image
                                  source={{
                                    uri: veryPopularRecipes[index].image,
                                  }}
                                  style={styles.imageHolder}
                                ></Image>
                                <TouchableOpacity
                                  style={{ position: "absolute", padding: 5 }}
                                  onPress={() => {
                                    console.log("Pressed very popular!")
                                    veryPopularRecipes[index].loved = !veryPopularRecipes[index].loved;
                                    console.log(veryPopularRecipes[index].loved);
                                    veryPopularRecipes[index].loved
                                      ? addFavoriteRecipe(veryPopularRecipes[index])
                                      : deleteFavoriteRecipe(veryPopularRecipes[index]);

                                  }}>
                                  <MaterialCommunityIcons
                                    size={30}
                                    name={
                                      veryPopularRecipes[index].loved
                                        ? "heart"
                                        : "heart-outline"
                                    }
                                    color={veryPopularRecipes[index].loved ? colors.font_red : colors.white}
                                  />
                                </TouchableOpacity>
                                {/* Hole all recipe info */}
                                <View style={{ paddingRight: 3, paddingLeft: 3 }}>
                                  <Text numberOfLines={1} style={styles.recipeTitle}>
                                    {veryPopularRecipes[index].title}
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeLikes}>
                                    {nFormatter(veryPopularRecipes[index].likes, 1)}{" "}
                                    likes
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeUsedIngredients}>
                                    {veryPopularRecipes[index].usedIngredients.length}{" "}
                                    ingredients
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeMissingIngredients}>
                                    {veryPopularRecipes[index].missedIngredients.length}{" "}
                                    missings
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}
          {veryHealthyRecipes.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                  Very Healthy
                </Text>
              </View>
              <View>
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={veryHealthyRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity
                            onPress={() =>
                              setChosenRecipe(veryHealthyRecipes[index])
                            }
                          >
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: "column", height: '100%', minHeight: 240 }}>
                                <Image
                                  source={{
                                    uri: veryHealthyRecipes[index].image,
                                  }}
                                  style={styles.imageHolder}
                                ></Image>
                                <TouchableOpacity
                                  style={{ position: "absolute", padding: 5 }}
                                  onPress={() => {
                                    console.log("Pressed very healthy!")
                                    veryHealthyRecipes[index].loved = !veryHealthyRecipes[index].loved;
                                    console.log(veryHealthyRecipes[index].loved);
                                    veryHealthyRecipes[index].loved
                                      ? addFavoriteRecipe(veryHealthyRecipes[index])
                                      : deleteFavoriteRecipe(veryHealthyRecipes[index]);

                                  }}>
                                  <MaterialCommunityIcons
                                    size={30}
                                    name={
                                      veryHealthyRecipes[index].loved
                                        ? "heart"
                                        : "heart-outline"
                                    }
                                    color={veryHealthyRecipes[index].loved ? colors.font_red : colors.white}
                                  />
                                </TouchableOpacity>
                                {/* Hole all recipe info */}
                                <View style={{ paddingRight: 3, paddingLeft: 3 }}>
                                  {/* Title */}
                                  <Text numberOfLines={1} style={styles.recipeTitle} >
                                    {veryHealthyRecipes[index].title}
                                  </Text>

                                  {/* Likes */}
                                  <Text numberOfLines={1} style={styles.recipeLikes}>
                                    {nFormatter(veryHealthyRecipes[index].likes, 1)}{" "}
                                    likes
                                  </Text>
                                  {/* Used Ingre*/}
                                  <Text numberOfLines={1} style={styles.recipeUsedIngredients}>
                                    {veryHealthyRecipes[index].usedIngredients.length}{" "}
                                    ingredients
                                </Text>
                                  {/* Missings Ingre */}
                                  <Text numberOfLines={1} style={styles.recipeMissingIngredients}>
                                    {veryHealthyRecipes[index].missedIngredients.length}{" "}
                                    missings
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}
          {vegetarianRecipes.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 21, fontWeight: "bold" }}>
                  Vegeterian
                </Text>
              </View>
              <View>
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={vegetarianRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity
                            onPress={() =>
                              setChosenRecipe(vegetarianRecipes[index])
                            }
                          >
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: "column", height: '100%', minHeight: 240 }}>
                                <Image
                                  source={{
                                    uri: vegetarianRecipes[index].image,
                                  }}
                                  style={styles.imageHolder}
                                ></Image>
                                <TouchableOpacity
                                  style={{ position: "absolute", padding: 5 }}
                                  onPress={() => {
                                    console.log("Pressed vegetarian!")
                                    vegetarianRecipes[index].loved = !vegetarianRecipes[index].loved;
                                    console.log(vegetarianRecipes[index].loved);
                                    vegetarianRecipes[index].loved
                                      ? addFavoriteRecipe(vegetarianRecipes[index])
                                      : deleteFavoriteRecipe(vegetarianRecipes[index]);

                                  }}>
                                  <MaterialCommunityIcons
                                    size={30}
                                    name={
                                      vegetarianRecipes[index].loved
                                        ? "heart"
                                        : "heart-outline"
                                    }
                                    color={vegetarianRecipes[index].loved ? colors.font_red : colors.white}
                                  />
                                </TouchableOpacity>
                                {/* Hole all recipe info */}
                                <View style={{ paddingRight: 3, paddingLeft: 3 }}>
                                  <Text numberOfLines={1} style={styles.recipeTitle}>
                                    {vegetarianRecipes[index].title}
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeLikes}>
                                    {nFormatter(vegetarianRecipes[index].likes, 1)}{" "}
                                    likes
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeUsedIngredients}>
                                    {vegetarianRecipes[index].usedIngredients.length}{" "}
                                    ingredients
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeMissingIngredients}>
                                    {vegetarianRecipes[index].missedIngredients.length}{" "}
                                    missings
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}
          {otherRecipes.length > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={{ fontSize: 21, fontWeight: "bold" }}>Others</Text>
              </View>
              <View>
                <FlatList
                  style={styles.recipeScroll}
                  showsHorizontalScrollIndicator={false}
                  data={otherRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity
                            onPress={() => setChosenRecipe(otherRecipes[index])}
                          >
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: "column", height: '100%', minHeight: 240 }}>
                                <Image
                                  source={{ uri: otherRecipes[index].image }}
                                  style={styles.imageHolder}
                                ></Image>
                                <TouchableOpacity
                                  style={{ position: "absolute", padding: 5 }}
                                  onPress={() => {
                                    console.log("Pressed other!")
                                    otherRecipes[index].loved = !otherRecipes[index].loved;
                                    console.log(otherRecipes[index].loved);
                                    otherRecipes[index].loved
                                      ? addFavoriteRecipe(otherRecipes[index])
                                      : deleteFavoriteRecipe(otherRecipes[index]);

                                  }}>
                                  <MaterialCommunityIcons
                                    size={30}
                                    style={{ position: "absolute", padding: 5 }}
                                    name={
                                      otherRecipes[index].loved
                                        ? "heart"
                                        : "heart-outline"
                                    }
                                    color={otherRecipes[index].loved ? colors.font_red : colors.white}
                                  />
                                </TouchableOpacity>
                                {/* Hole all recipe info */}
                                <View style={{ paddingRight: 3, paddingLeft: 3 }}>
                                  <Text numberOfLines={1} style={styles.recipeTitle}>
                                    {otherRecipes[index].title}
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeLikes}>
                                    {nFormatter(otherRecipes[index].likes, 1)}{" "}
                                    likes
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeUsedIngredients}>
                                    {otherRecipes[index].usedIngredients.length}{" "}
                                    ingredients
                                  </Text>
                                  <Text numberOfLines={1} style={styles.recipeMissingIngredients}>
                                    {otherRecipes[index].missedIngredients.length}{" "}
                                    missings
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
            </View>
          )}
          <View style={{ height: 60 }}></View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 0,
    backgroundColor: colors.light,
  },
  container: {
    flex: 1,
  },
  searchBar: {
    backgroundColor: colors.background,
    marginLeft: screenWidth * 0.02,
    marginRight: screenWidth * 0.02,
  },
  inputSearchBar: {
    borderRadius: 30,
    paddingLeft: 10,
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
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
  sectionHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    // paddingTop: 8,
    // paddingBottom: 8,
  },
  imageHolder: {
    width: "100%",
    marginRight: 14,
    height: 131,
    borderRadius: 10,
    // marginRight: 8,
  },
  recipeTitle: {
    fontSize: 16,
    marginTop: 6,
    color: colors.grey,
    fontWeight: "bold",
  },
  recipeLikes: {
    fontSize: 12,
    marginTop: 3,
    color: "#B3B3B5",
  },
  recipeUsedIngredients: {
    fontSize: 12,
    marginTop: 5,
    color: "#00C2CB",
    fontWeight: "bold",
  },
  recipeMissingIngredients: {
    fontSize: 12,
    marginTop: 3,
    color: "#FF5757",
    fontWeight: "bold",
  },
  recipeScroll: {
    // marginLeft: 6,
    paddingTop: 10,
    paddingBottom: 10,
    height: screenHeight / 3.3,
  },
  recipeCard: {
    marginLeft: 16,
    backgroundColor: "white",
    borderRadius: 20,
    width: screenWidth / 2.4,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
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
      addRecipe,
      clearRecipe,
      addIngredientToCart,
      addFavoriteRecipe,
      deleteFavoriteRecipe,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecipeTab);