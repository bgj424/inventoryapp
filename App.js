import React, { useEffect, useState } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { AddCollection } from './AddCollection';
import { AddItem } from './AddItem';
import { ItemInfo } from './ItemInfo';
import { Frontpage, Login, Registration } from './Home';
import { SettingsScreen, Settings } from './Settings';
import { LoadingScreen } from './Misc';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as db from './Database';
import { ref, get, onValue} from "firebase/database";
import { BarcodeScanner } from './BarcodeScanner';
import { ItemList } from './ItemList';
import { CollectionList } from './CollectionList';
import { InventoryAppLight, InventoryAppDark } from './Themes';

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator>
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Registration" component={Registration} />
    </AuthStack.Navigator>
  )
}

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Frontpage" component={Frontpage} />
        <HomeStack.Screen name="Settings" component={SettingsScreen} />
    </HomeStack.Navigator>
  )
}

const ItemsNavigator = () => {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen name="Collections" component={CollectionList} />
      <ItemsStack.Screen name="New Collection" component={AddCollection} />
      <ItemsStack.Screen name="Item List" component={ItemList} 
        options={({ route }) => ({ title: route.params.collection ?? "Collection" })} 
      />
      <ItemsStack.Screen name="Add Item" component={AddItem} 
        options={({ route }) => ({ title: route.params.edit ? "Edit Item Information" : "Add Item" })} 
      />
      <ItemsStack.Screen name="Barcode Scanner" component={BarcodeScanner} />
      <ItemsStack.Screen name="Item Information" component={ItemInfo} />
    </ItemsStack.Navigator>
  )
}

export const ThemeContext = React.createContext();

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [user, setUser] = useState('');
  
  const [theme, setTheme] = useState(null); // Set app theme to OS preference
  const themeData = { theme, setTheme };

  const [userData, setUserData] = useState({});

  // Get auth status from firebase
  db.auth.onAuthStateChanged((user) => {
    if (user) setUser(user)
    else setUser('')
    if(!initialized) {
      // Get user's data and settings
      onValue(ref(
        db.database, 'users/' + db.auth.currentUser.uid + '/userdata'
      ), (snapshot) => {
          const data = snapshot.val();
          if(data) { 
            setUserData(data)
            if(data.theme) setTheme(data.theme)
            setInitialized(true)
          }
      })
    }
  });

  if(!initialized || !user) {
    return <LoadingScreen />
  }

  return(
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer theme={theme === 'dark' ? InventoryAppDark : InventoryAppLight}>
        {!user ? (
          <AuthNavigator></AuthNavigator>
        ) : (
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
        )}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}