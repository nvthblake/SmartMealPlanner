import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from '../screens/AccountScreen';
import ListingEditScreen from '../screens/ListingEditScreen';
import ListingsScreen from '../screens/ListingsScreen';
import FeedNavigator from './FeedNavigator';
import AccountNavigator from './AccountNavigator';
import Profile from '../tabs/ProfileTab';

import { MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import AddItemButton from './AddItemButton';
import Icon from '../components/Icon';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import ViewImageScreen from '../screens/ViewImageScreen';
import colors from '../config/colors';
import IngredientsTab from '../tabs/IngredientsTab';
import ShoppingList from '../tabs/ShoppingTab';
import RecipeTab from '../tabs/RecipeTab';
import ScanTab from '../tabs/ScanTab';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
    <Tab.Navigator tabBarOptions={{ keyboardHidesTabBar: true }}>
        <Tab.Screen name="Ingredients" component={IngredientsTab} options={{
            tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons name="fridge-outline" color={color} size={size} />
        }} />
        <Tab.Screen name="Recipes" component={RecipeTab} options={{
            tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons name="silverware-variant" color={color} size={size} />
        }} />
        <Tab.Screen
            name="ScanTab"
            component={ScanTab}
            options={({ navigation }) => ({
                tabBarButton: () => <AddItemButton onPress={() => navigation.navigate("ScanTab")} />,
                tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons 
                name="plus-circle" 
                color={color} 
                size={size} />
            })}/>
        <Tab.Screen name="Shopping" component={ShoppingList} options= {{
            tabBarIcon: ({ color, size }) => 
                // <MaterialCommunityIcons name="home" color={color} size={size} />
                <Feather name="shopping-cart" size={size} color={color} />
        }} />
        <Tab.Screen name="Account" component={Profile} options={{
            tabBarIcon: ({ color, size }) =>
                // <MaterialCommunityIcons name="account" color={color} size={size} />
                <MaterialIcons name="person-outline" size={size} color={color} />
        }} />
    </Tab.Navigator>
)

export default AppNavigator;