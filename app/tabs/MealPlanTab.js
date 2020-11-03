import React, { Component, Fragment, useState } from "react";
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

// Misc
import colors from "../config/colors";
import { ScrollView } from "react-native-gesture-handler";

/* Copied from IngredientsTab */
const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

function MealPlanTab(state) {
    const {
        mealPlanner,
        favoriteRecipes,
        addMealPlan, deleteMealPlan, clearRecipe,
        addFavoriteRecipe, deleteFavoriteRecipe, clearFavoriteRecipe
    } = state;
    const [isLoading, setIsLoading] = useState(true);
    const curDate = new Date();

    let datesWhitelist = [{
        start: moment(),
        end: moment().add(13, 'days')  // total 2 weeks
    }];


    const getMealPlanOnDate = (date) => {
        const mealPlan = [];

        return mealPlan;
    }

    // const getFavoriteRecipes = () => {
    //     const recipes = []

    //     return recipes;
    // }

    const selectedMealPlan = getMealPlanOnDate(curDate);
    // const favoriteRecipes = getFavoriteRecipes();

    const onChange = (e) => {

    }

    const markedCurDate = [
        {
            date: curDate,
            dots: [
                {
                    color: 'white',
                },
            ],
        },
    ];

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, backgroundColor: colors.primary }} />
            <Screen style={styles.screen}>

                {/* Calendar */}
                <View style={styles.container}>
                    <CalendarStrip
                        calendarAnimation={{ type: 'sequence', duration: 30 }}
                        daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 2, borderHighlightColor: 'white' }}
                        style={{ height: 100, paddingBottom: 10 }}
                        calendarHeaderStyle={{ color: 'white' }}
                        calendarColor={colors.primary}
                        dateNumberStyle={{ color: 'white' }}
                        dateNameStyle={{ color: 'white' }}
                        highlightDateNumberStyle={{ color: 'white' }}
                        highlightDateNameStyle={{ color: 'white' }}
                        disabledDateNameStyle={{ color: 'black' }}
                        disabledDateNumberStyle={{ color: 'black' }}
                        datesWhitelist={datesWhitelist}
                        // iconLeft={require('./img/left-arrow.png')}
                        // iconRight={require('./img/right-arrow.png')}
                        iconContainer={{ flex: 0.1 }}
                        markedDates={markedCurDate}
                    />
                </View>


            </Screen>

        </Fragment>
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
    const { mealPlanner, favoriteRecipes } = state;
    return { mealPlanner, favoriteRecipes };
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
