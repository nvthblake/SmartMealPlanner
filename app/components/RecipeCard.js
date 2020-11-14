import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, View, Image, StyleSheet, FlatList, Platform, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { addRecipe } from '../../actions';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { nFormatter } from '../utils/NumberFormatting';

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

class RecipeCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recipe: this.props.recipe
        }
    }

    componentDidMount() {
        this.setState({
            recipe: this.props.recipe
        })
    };

    openURLInDefaultBrowser = (url) => {
        Linking.canOpenURL(url).then(supported => {
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
        const avaUrl = `https://randomuser.me/api/portraits/${isMan ? 'men' : 'women'}/${randomNumber}.jpg`;

        return (
            <View style={{ paddingBottom: 5 }}>
                <View style={styles.recipeCard}>
                    <TouchableOpacity onPress={() => openURLInDefaultBrowser(recipe.sourceUrl)}>
                        <View style={{ padding: 10 }}>
                            <View style={{ flexDirection: 'column' }}>
                                <Image source={{ uri: recipe.image }} style={{ width: '100%', marginRight: 14, height: 140, borderRadius: 10, marginRight: 8 }}></Image>
                                <Text numberOfLines={2} style={styles.recipeTitle}>{recipe.title}</Text>
                                <Text numberOfLines={1} style={styles.recipeLikes}>{nFormatter(recipe.likes, 1)} likes</Text>
                                <Text numberOfLines={1} style={styles.recipeUsedIngredients}>{recipe.usedIngredients.length} ingredients</Text>
                                <Text numberOfLines={1} style={styles.recipeMissingIngredients}>{recipe.missedIngredients.length} missings</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    descContainer: {
        flexDirection: "row",
        paddingTop: 15
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
    }
});

const mapStateToProps = (state) => {
    const { ingredients } = state
    return { ingredients }
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
        addRecipe,
    }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);
