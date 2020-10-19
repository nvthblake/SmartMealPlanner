import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Text, View, Image, StyleSheet, FlatList } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { addRecipe } from '../../actions';
import { TouchableOpacity } from 'react-native-gesture-handler';

class RecipeCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const recipe = this.props.recipe;
        console.log("RecipeCard -> render -> recipes", recipe)
        const isMan = Math.floor(Math.random() * Math.floor(2));
        const randomNumber = Math.floor(Math.random() * Math.floor(99));
        const avaUrl = `https://randomuser.me/api/portraits/${isMan ? 'men' : 'women'}/${randomNumber}.jpg`;

        return (
            <View style={styles.container}>
                <Image source={{ uri: recipe.image }} style={{ height: 200 }} />
                <View style={styles.descContainer}>
                    <Image source={{ uri: avaUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
                    <View style={styles.recipeDetails}>
                        <Text numberOfLines={1} style={styles.recipeTitle}>{recipe.title}</Text>
                        <Text numberOfLines={1} style={styles.recipeUsedIngredients}>Used: {recipe.usedIngredients.map(usedIngredient => capitalize(usedIngredient.name)).join(", ") + " · " + nFormatter(recipe.likes, 1)} likes</Text>
                        <Text numberOfLines={1} style={styles.recipeMissingIngredients}>Missing: {recipe.missedIngredients.map(missedIngredient => capitalize(missedIngredient.name)).join(", ")}</Text>
                    </View>
                    <TouchableOpacity>
                        <Icon name="more-vert" size={20} color="#999999" />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function nFormatter(num, digits) {
    var si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "k" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
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
        color: "#3c3c3c",
        fontWeight: "bold"
    },
    recipeDetails: {
        paddingHorizontal: 15,
        flex: 1
    },
    recipeUsedIngredients: {
        fontSize: 15,
        paddingTop: 3,
        color: "#2e7d32"
    },
    recipeMissingIngredients: {
        fontSize: 15,
        paddingTop: 3,
        color: "#c2185b"
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
