import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';

// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

import Screen from "../components/Screen";
import colors from "../config/colors";

import { addRecipe, clearRecipe } from "../../actions";


class MealPlanTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        }
    }

    render() {
        return (
            <Screen style={styles.screen}>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <View>
                            <Text style={styles.title}>
                                Meal Planning
                            </Text>
                        </View>

                        <Calendar
                            style={styles.calendar}
                            markingType={'period'}
                            markedDates={{
                                '2020-10-15': { marked: true, dotColor: colors.primary },
                                '2020-10-16': { marked: true, dotColor: colors.primary },
                                '2020-10-21': { startingDay: true, color: colors.primary, textColor: 'white' },
                                '2020-10-22': { color: colors.light_primary, textColor: 'white' },
                                '2020-10-23': { color: colors.light_primary, textColor: 'white', marked: true, dotColor: 'white' },
                                '2020-10-24': { color: colors.light_primary, textColor: 'white' },
                                '2020-10-25': { endingDay: true, color: colors.primary, textColor: 'white' },
                            }}
                        />
                    </View>
                </View>
            </Screen>
        );
    }
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: 8,
        backgroundColor: colors.light,
        flex: 1,
    },
    container: {
        flex: 1,
    },
    body: {
        flex: 1,
    },
    calendar: {
        padding: 8,
        margin: 25,
        borderRadius: 20,
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


export default MealPlanTab;
