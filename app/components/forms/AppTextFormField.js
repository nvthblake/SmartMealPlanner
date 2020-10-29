import React from 'react';
import { StyleSheet } from "react-native";

import AppFormField from "./AppFormField";

function AppTextFormField({ title, name, ...otherProps }) {
    return (
        <View
            style={{flexDirection: "row"}}
        >
            <Text>{title}</Text>
            <AppFormField
                name={name}
                placeholder={title}
                {...otherProps}
            />
        </View>
    );
}

const styles = StyleSheet.create({});

export default AppTextFormField;