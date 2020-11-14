/* React */
import React, { useEffect, useState, Component } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Text,
  Platform,
  Linking,
  Button
} from "react-native";
import { render } from "react-dom";

/* Custom components */
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import Screen from "../components/Screen";
import LoadingAnimation from '../components/LoadingAnimation';
import CircularOverview from '../components/CircularOverview';

/* Models */
import Recipe from "../models/Recipe";
import SpoonacularIngredient from "../models/SpoonacularIngredient";

/* Redux */
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { addRecipe, clearRecipe, addIngredientToCart } from "../../actions";

/* APIs */
import { getRecipes, getRecipeInfoInBulk } from '../api/Spoonacular';

/* 3rd party */
import Icon from "react-native-vector-icons/MaterialIcons";
import Modal from 'react-native-modal';

/* Miscellaneous */
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";
import { nFormatter } from '../utils/NumberFormatting';
import { capitalize } from '../utils/TextFormatting';

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const INITIAL_CATEGORIES_STATE = [
  {
    title: "All",
    selected: true
  }
];

function RecipeTab(state) {
  const { ingredients, addRecipe, clearRecipe, addIngredientToCart } = state;

  const ingredientsInFridge = ingredients.fridge;
  const recipes = ingredients.recipes;

  const [categories, setCategory] = useState(INITIAL_CATEGORIES_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isResultEmpty, setIsResultEmpty] = useState(false);
  const [chosenRecipe, setChosenRecipe] = useState(null);

  resetCategories = () => {
    setCategory(INITIAL_CATEGORIES_STATE);
  }

  const addCategories = (categoryNames) => {
    let new_categories_state = [...categories];
    const currentCategories = new_categories_state.map(category => category.title);
    categoryNames.forEach(categoryName => {
      if (currentCategories.indexOf(categoryName) < 0) {
        new_categories_state.push({
          title: categoryName,
          selected: false
        });
      }
    });
    setCategory(new_categories_state);
  }

  const toggleCategory = (selectedCategory) => {
    console.log("toggleCategory -> selectedCategory", selectedCategory)
    let new_categories_state = [...categories];

    if (selectedCategory.title === "All") {
      new_categories_state = new_categories_state.map((old_category_state) => {
        console.log("toggleCategory -> old_category_state", old_category_state.title)
        if (old_category_state.title === "All") {
          return {
            selected: true,
            title: old_category_state.title,
          }
        }
        else {
          return {
            selected: false,
            title: old_category_state.title,
          }
        }
      });
    }
    else {
      new_categories_state[0].selected = false;
      new_categories_state = new_categories_state.map((old_category_state) => {
        if (selectedCategory.title === old_category_state.title) {
          return {
            selected: !old_category_state.selected,
            title: old_category_state.title,
          };
        }
        else {
          return {
            selected: old_category_state.selected,
            title: old_category_state.title,
          };
        }
      });
    }
    console.log("toggleCategory -> new_categories_state", new_categories_state)
    setCategory(new_categories_state);
  };

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

  const openURLInDefaultBrowser = (url) => {
    Linking.canOpenURL(url).then(supported => {
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
        ingredient: usedIngredient
      })
    });
    recipe.missedIngredients.forEach((missedIngredient) => {
      result.push({
        isMissing: true,
        ingredient: missedIngredient
      })
    });
    return result;
  }

  const addMissedIngredientsToCard = (missedIngredients) => {
    console.log("addMissedIngredientsToCard -> missedIngredients", missedIngredients)
    missedIngredients.forEach((missedIngredient) => {
      addIngredientToCart(missedIngredient);
    });

    
  }

  useEffect(() => {
    getRecipes(ingredientsInFridge, 10).then((step1_recipes) => {
      if (step1_recipes.length === 0) {
        setIsResultEmpty(true);
        setIsLoading(false);
        return;
      }

      getRecipeInfoInBulk(step1_recipes).then((final_recipes) => {
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
      }).catch((err) => {
        setIsResultEmpty(true);
        setIsLoading(false);
      });
    }).catch((err) => {
      setIsResultEmpty(true);
      setIsLoading(false);
    });
  }, [ingredientsInFridge]);

  const filteredRecipes = getRecipesBasedOnFilter(recipes);
  const veryPopularRecipes = filteredRecipes.filter((recipe) => recipe.veryPopular);
  const veryHealthyRecipes = filteredRecipes.filter((recipe) => recipe.veryHealthy);
  const vegetarianRecipes = filteredRecipes.filter((recipe) => recipe.vegetarian);
  const otherRecipes = filteredRecipes.filter((recipe) => !recipe.vegetarian && !recipe.veryPopular && !recipe.veryHealthy);

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
        {"Recipes"}
      </AppText>
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
              textColor={categories[index].selected ? colors.white : colors.primary}
              onPress={() => toggleCategory(categories[index])}
              title={capitalize(categories[index].title)}
            />
          )}
        ></FlatList>
      </View>

      <Modal isVisible={!!chosenRecipe} coverScreen={true} onBackdropPress={() => setChosenRecipe(null)} backdropColor={"#F2F5F8"} backdropOpacity={0.9}>
        <View style={styles.modalCard}>
          {!!chosenRecipe && <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View>
              <Image resizeMode={"cover"} source={{ uri: chosenRecipe.image }} style={{ width: '100%', marginRight: 14, height: 160, borderRadius: 10, marginRight: 8 }}></Image>
              <Text style={{ color: '#4F555E', fontSize: 20, paddingHorizontal: 8, fontWeight: '600', paddingVertical: 12, textAlign: 'center' }}>{chosenRecipe.title}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8 }}>
                <CircularOverview stat={chosenRecipe.servings.toString()} title={"Servings"} size={Math.floor(screenWidth / 5.5)} />
                <CircularOverview stat={chosenRecipe.readyInMinutes.toString() + " mins"} title={"Time"} size={Math.floor(screenWidth / 5.5)} />
                <CircularOverview stat={(Math.floor(chosenRecipe.spoonacularScore * 0.05)).toString() + "/5"} title={"Ratings"} size={Math.floor(screenWidth / 5.5)} />
              </View>
              <View style={{ height: 1, marginHorizontal: 8, backgroundColor: 'lightgrey', marginVertical: 12 }}></View>
              <Text style={{ marginHorizontal: 8, fontWeight: '500', fontSize: 15 }}>Ingredients</Text>
              <FlatList
                data={getAllNeededIngredientsForRecipe(chosenRecipe)}
                keyExtractor={(ingredient) => ingredient.ingredient.id.toString() + "-chosen"}
                renderItem={({ ingredient, index }) => {
                  return (
                    <View>
                      <Text style={{ marginHorizontal: 8, color: getAllNeededIngredientsForRecipe(chosenRecipe)[index].isMissing ? '#D76774' : '#4F555E', fontSize: 16, marginVertical: 4 }}>{capitalize(getAllNeededIngredientsForRecipe(chosenRecipe)[index].ingredient.name)}</Text>
                    </View>
                  )
                }}>
              </FlatList>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', backgroundColor: 'white', justifyContent: 'space-between' }}>
              <TouchableOpacity style={{ borderColor: '#3E73FB', width: Math.floor(screenWidth / 4), borderRadius: 8, paddingVertical: 8, borderWidth: 1 }} onPress={() => setChosenRecipe(null)}><Text style={{ color: '#3E73FB', fontSize: 16, textAlign: 'center' }}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#3E73FB', width: Math.floor(screenWidth / 4), borderRadius: 8, paddingVertical: 8 }} onPress={() => openURLInDefaultBrowser(chosenRecipe.sourceUrl)}><Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>See Details</Text></TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#FFBE6A', width: Math.floor(screenWidth / 4), borderRadius: 8, paddingVertical: 8 }} onPress={() => addMissedIngredientsToCard(chosenRecipe.missedIngredients)}><Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>Add to 🛒</Text></TouchableOpacity>
            </View>
          </View>}
        </View>
      </Modal>
      {(!isLoading && isResultEmpty) && <View style={{ width: screenWidth, height: screenHeight / 1.5 }}><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 17, textAlign: 'center' }}>{"I can't find any recipes 😢\nTry adding more ingredients"}</Text></View></View>}
      {isLoading && <View style={{ width: screenWidth, height: screenHeight / 1.5 }}><LoadingAnimation show={isLoading} label={'Finding the best recipes for you...'} /></View>}
      {!isLoading &&
        <ScrollView>
          {veryPopularRecipes.length > 0 &&
            <View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Very Popular</Text>
              </View>
              <View>
                <FlatList
                  data={veryPopularRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity onPress={() => {
                            console.log(veryPopularRecipes[index])
                            setChosenRecipe(veryPopularRecipes[index])
                          }}>
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: 'column' }}>
                                <Image source={{ uri: veryPopularRecipes[index].image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                <Text numberOfLines={2} style={styles.recipeTitle}>{veryPopularRecipes[index].title}</Text>
                                <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(veryPopularRecipes[index].likes, 1)} likes</Text>
                                <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{veryPopularRecipes[index].usedIngredients.length} ingredients</Text>
                                <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{veryPopularRecipes[index].missedIngredients.length} missings</Text>
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
          {veryHealthyRecipes.length > 0 &&
            <View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Very Healthy</Text>
              </View>
              <View>
                <FlatList
                  data={veryHealthyRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity onPress={() => setChosenRecipe(veryHealthyRecipes[index])}>
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: 'column' }}>
                                <Image source={{ uri: veryHealthyRecipes[index].image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                <Text numberOfLines={2} style={styles.recipeTitle}>{veryHealthyRecipes[index].title}</Text>
                                <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(veryHealthyRecipes[index].likes, 1)} likes</Text>
                                <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{veryHealthyRecipes[index].usedIngredients.length} ingredients</Text>
                                <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{veryHealthyRecipes[index].missedIngredients.length} missings</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }}>
                </FlatList>
              </View>
            </View>
          }
          {vegetarianRecipes.length > 0 &&
            <View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Vegeterian</Text>
              </View>
              <View>
                <FlatList
                  data={vegetarianRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity onPress={() => setChosenRecipe(vegetarianRecipes[index])}>
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: 'column' }}>
                                <Image source={{ uri: vegetarianRecipes[index].image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                <Text numberOfLines={2} style={styles.recipeTitle}>{vegetarianRecipes[index].title}</Text>
                                <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(vegetarianRecipes[index].likes, 1)} likes</Text>
                                <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{vegetarianRecipes[index].usedIngredients.length} ingredients</Text>
                                <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{vegetarianRecipes[index].missedIngredients.length} missings</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }}>
                </FlatList>
              </View>
            </View>
          }
          {otherRecipes.length > 0 &&
            <View>
              <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Others</Text>
              </View>
              <View>
                <FlatList
                  data={otherRecipes}
                  horizontal={true}
                  keyExtractor={(recipe) => recipe.id.toString()}
                  renderItem={({ recipe, index }) => {
                    return (
                      <View style={{ paddingBottom: 5 }}>
                        <View style={styles.recipeCard}>
                          <TouchableOpacity onPress={() => setChosenRecipe(otherRecipes[index])}>
                            <View style={{ padding: 10 }}>
                              <View style={{ flexDirection: 'column' }}>
                                <Image source={{ uri: otherRecipes[index].image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                <Text numberOfLines={2} style={styles.recipeTitle}>{otherRecipes[index].title}</Text>
                                <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(otherRecipes[index].likes, 1)} likes</Text>
                                <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{otherRecipes[index].usedIngredients.length} ingredients</Text>
                                <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{otherRecipes[index].missedIngredients.length} missings</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )
                  }}>
                </FlatList>
              </View>
            </View>
          }
          <View style={{ height: 60 }}></View>
        </ScrollView>
      }
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingVertical: 20,
    backgroundColor: colors.light,
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
  recipeTitle: {
    fontSize: 16,
    marginTop: 6,
    color: "#3c3c3c",
    fontWeight: "bold"
  },
  recipeLikes: {
    fontSize: 15,
    marginTop: 3,
    color: "#B3B3B5"
  },
  recipeUsedIngredients: {
    fontSize: 15,
    marginTop: 12,
    color: "#5BCBC5"
  },
  recipeMissingIngredients: {
    fontSize: 15,
    marginTop: 3,
    color: "#D76774"
  },
  recipeCard: {
    marginLeft: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    width: screenWidth / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    })
  },
  modalCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: screenHeight / 7,
    padding: 12
  }
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
      addIngredientToCart
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecipeTab);
