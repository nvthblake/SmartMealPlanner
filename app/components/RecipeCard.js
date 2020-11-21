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

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class RecipeCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipe: this.props.recipe,
      setChosenRecipeFunc: this.props.setChosenRecipeFunc,
      header: this.props.header,
      heartImage: "heart",
    };
  }

  componentDidMount() {
    this.setState({
      recipe: this.props.recipe,
      header: this.props.header,
      setChosenRecipeFunc: this.props.setChosenRecipeFunc,
      heartImage: this.props.recipe.loved ? "heart" : "heart-outline",
    });
  }

  openURLInDefaultBrowser = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert("Don't know how to open URI: " + url);
      }
    });
  };

  render() {
    const recipe = this.props.recipe;
    // console.log("RecipeCard -> render -> recipes", recipe)
    const isMan = Math.floor(Math.random() * Math.floor(2));
    const randomNumber = Math.floor(Math.random() * Math.floor(99));
    const avaUrl = `https://randomuser.me/api/portraits/${isMan ? "men" : "women"
      }/${randomNumber}.jpg`;
    const setChosenRecipeFunc = this.props.setChosenRecipeFunc;

    return (
      <View style={{ margin: 1 }}>
        <View style={styles.recipeCard}>
          <TouchableOpacity
            onPress={() => {
              setChosenRecipeFunc(recipe);
            }}
          >
            <View style={{ padding: 8 }}>
              <View style={{ flexDirection: "column", height: '100%', minHeight: 240 }}>
                <Image
                  source={{ uri: recipe.image }}
                  style={{
                    width: "100%",
                    height: 131,
                    borderRadius: 10,
                    marginRight: 8,
                  }}
                ></Image>

                <View style={styles.textHolder}>
                  <Text numberOfLines={2} style={styles.recipeHeader}>
                    {this.state.header}
                  </Text>
                  <Text numberOfLines={2} style={styles.recipeTitle}>
                    {recipe.title}
                  </Text>
                </View>


              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  descContainer: {
    flexDirection: "row",
    paddingTop: 15,
  },
  textHolder: {
    alignItems: 'center'
  },
  recipeHeader: {
    fontSize: 20,
    marginTop: 6,
    color: "#575B63",
    fontWeight: "bold",
  },
  recipeTitle: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 6,
    color: "#AFAFAF",
  },
  recipeLikes: {
    fontSize: 12,
    marginTop: 3,
    color: "#B3B3B5",
  },
  recipeMissingIngredients: {
    fontSize: 12,
    marginTop: 12,
    fontWeight: "bold",
    color: "#FF5757",
  },
  recipeCard: {
    marginLeft: 10,
    backgroundColor: "white",
    borderRadius: 20,
    width: screenWidth / 2.4,
    // height: '100%',
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
});

const mapStateToProps = (state) => {
  const { ingredients } = state;
  return { ingredients };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addRecipe,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);
