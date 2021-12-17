import React from 'react';
import { ItemList, AddItem, BarcodeScanner, AddItemInfo, ItemInfo } from './Items';
import { Frontpage, Login, Registration } from './Home';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';

const HomeStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Login" component={Login} />
      <HomeStack.Screen name="Frontpage" component={Frontpage} />
      <HomeStack.Screen name="Registration" component={Registration} />
    </HomeStack.Navigator>
  )
}

const ItemsNavigator = () => {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen name="Item List" component={ItemList} />
      <ItemsStack.Screen name="Add Item" component={AddItem} />
      <ItemsStack.Screen name="Barcode Scanner" component={BarcodeScanner} />
      <ItemsStack.Screen name="Add Item Information" component={AddItemInfo} />
      <ItemsStack.Screen name="Item Information" component={ItemInfo} />
    </ItemsStack.Navigator>
  )
}

export default function App() {
  return(
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Items') {
              iconName = 'reorder-four-outline';
            } return <Ionicons name={iconName} size={size} color={color} />;  
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Items" component={ItemsNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}