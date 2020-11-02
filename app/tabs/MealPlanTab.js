import React, { Component, Fragment } from "react";
import { StyleSheet, View, Text, Dimensions, SafeAreaView } from "react-native";
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

// import { connect } from "react-redux";
// import { bindActionCreators } from "redux";

import Screen from "../components/Screen";
import colors from "../config/colors";

import { addRecipe, clearRecipe } from "../../actions";
import { color } from "react-native-reanimated";


class MealPlanTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
        }
        let datesWhitelist = [{
            start: moment(),
            end: moment().add(3, 'days')  // total 4 days enabled
        }];
        let datesBlacklist = [moment().add(1, 'days')]; // 1 day disabled
    }

    render() {
        return (
            <Fragment>
                <SafeAreaView style={{ flex: 0, backgroundColor: colors.primary }} />
                <Screen style={styles.screen}>
                    <View style={styles.container}>
                        <CalendarStrip
                            calendarAnimation={{ type: 'sequence', duration: 30 }}
                            daySelectionAnimation={{ type: 'border', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                            style={{ height: 100, paddingBottom: 10 }}
                            calendarHeaderStyle={{ color: 'white' }}
                            calendarColor={colors.primary}
                            dateNumberStyle={{ color: 'white' }}
                            dateNameStyle={{ color: 'white' }}
                            highlightDateNumberStyle={{ color: 'yellow' }}
                            highlightDateNameStyle={{ color: 'yellow' }}
                            disabledDateNameStyle={{ color: 'grey' }}
                            disabledDateNumberStyle={{ color: 'grey' }}
                            datesWhitelist={this.datesWhitelist}
                            datesBlacklist={this.datesBlacklist}
                            // iconLeft={require('./img/left-arrow.png')}
                            // iconRight={require('./img/right-arrow.png')}
                            iconContainer={{ flex: 0.1 }}
                        />


                    </View>
                </Screen>

            </Fragment>
        );
    }
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


export default MealPlanTab;
