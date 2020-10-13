import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";


import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import MessagesScreen from '../screens/MessagesScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Message" component={MessagesScreen} />
    </Stack.Navigator>
)

export default AuthNavigator;