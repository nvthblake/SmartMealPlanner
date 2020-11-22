
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Text,
  View,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { addRecipe } from "../../actions";
import { TouchableOpacity } from "react-native-gesture-handler";

import colors from "../config/colors";
import { nFormatter } from "../utils/NumberFormatting";


class RecipeScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <View>
        <FlatList
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
                      <View style={{ flexDirection: "column" }}>
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
                            color={colors.font_red}
                          />
                        </TouchableOpacity>
                        {/* Hole all recipe info */}
                        <View style={{ paddingRight: 3, paddingLeft: 3 }}>
                          {/* Title */}
                          <Text numberOfLines={2} style={styles.recipeTitle}>
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
    )
  }
}

export default RecipeScroll;