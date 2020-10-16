import React, {useState} from 'react';
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Checkbox } from 'react-native-paper';
import colors from "../config/colors";

function ShoppingItem({ item, pressHandler }) {
    const [checked, setChecked] = useState(false);

    return (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => {setChecked(!checked);}}
            onLongPress={() => pressHandler(item.key)}>
            <Checkbox 
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {setChecked(!checked);}}
                color={colors.primary}
                />
            <Text
                style={styles.item}>{item.text}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        padding: 10,
        marginTop: 16,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    item: {
        marginLeft: 10,
    },
    itemCross: {
        marginLeft: 10,
        textDecorationLine: 'line-through', 
        textDecorationStyle: 'solid'
    }

})

export default ShoppingItem;