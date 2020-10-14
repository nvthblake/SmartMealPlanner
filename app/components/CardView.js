import React from 'react';
import {StyleSheet, View} from 'react-native';

function CardView(props) {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                { props.children }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        elevation: 20,
        backgroundColor: '#fff',
        shadowOffset: {width: 5, height: 5},
        shadowColor: '#333',
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginHorizontal: 5,
        marginVertical: 5,  
    },
    cardContent: {
        marginVertical: 10,
        marginHorizontal: 10
    }
})

export default CardView;