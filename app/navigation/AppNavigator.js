import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AccountScreen from '../screens/AccountScreen';
import ListingEditScreen from '../screens/ListingEditScreen';
import ListingsScreen from '../screens/ListingsScreen';
import FeedNavigator from './FeedNavigator';
import AccountNavigator from './AccountNavigator';

import { MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import AddItemButton from './AddItemButton';
import Icon from '../components/Icon';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import ViewImageScreen from '../screens/ViewImageScreen';
import colors from '../config/colors';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen name="Ingredients" component={ListingsScreen} options= {{
            tabBarIcon: ({ color, size }) => 
                <MaterialCommunityIcons name="fridge-outline" color={color} size={size} />
        }} />
        <Tab.Screen name="Recipes" component={ListingDetailsScreen} options= {{
            tabBarIcon: ({ color, size }) => 
                <MaterialCommunityIcons name="silverware-variant" color={color} size={size} />
        }} />
        <Tab.Screen 
            name="ListingEdit" 
            component={ListingEditScreen}
            options={({navigation }) => ({
                tabBarButton: () =>  <AddItemButton onPress={() => navigation.navigate("ListingEdit") } />,
                tabBarIcon: ({ color, size }) =>
                <MaterialCommunityIcons 
                name="plus-circle" 
                color={color} 
                size={size} />
            })}/>
        <Tab.Screen name="Shopping" component={ViewImageScreen} options= {{
            tabBarIcon: ({ color, size }) => 
                // <MaterialCommunityIcons name="home" color={color} size={size} />
                <Feather name="shopping-cart" size={size} color={color} />
        }} />
        <Tab.Screen name="Account" component={AccountNavigator} options= {{
            tabBarIcon: ({ color, size }) => 
                // <MaterialCommunityIcons name="account" color={color} size={size} />
                <MaterialIcons name="person-outline" size={size} color={color} />
        }}/>
    </Tab.Navigator>
)

export default AppNavigator;