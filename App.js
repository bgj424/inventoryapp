import React, { useEffect, useState, createContext, useMemo, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import { LoginScreen } from './Login';
import { RegistrationScreen } from './Registration';
import { Frontpage } from './Home';
import { AddCollection } from './AddCollection';
import { AddItem } from './AddItem';
import { AddImage } from './AddImage';
import { SettingsScreen, Settings } from './Settings';
import { EditProfile } from './EditProfile';
import { LoadingScreen } from './Misc';
import { NavigationContainer, StackActions, useTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { database, auth } from './Database';
import { ref, get, onValue} from "firebase/database";
import { BarcodeScanner } from './BarcodeScanner';
import { ItemList } from './ItemList';
import { CollectionList } from './CollectionList';
import { InventoryAppLight, InventoryAppDark } from './Themes';
import { colors } from 'react-native-elements';
import { ThemeContext, UserContext } from './AppContext'; 

const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const ItemsStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const NavigatorStyles = {
    headerMode: 'screen',
    headerTintColor: 'white',
}

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator >
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Registration" component={RegistrationScreen} />
    </AuthStack.Navigator>
  )
}

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Frontpage" component={Frontpage} />
        <HomeStack.Screen name="Settings" component={SettingsScreen} />
        <HomeStack.Screen name="Edit Profile" component={EditProfile} />
        <HomeStack.Screen name="Add Image" component={AddImage} />
    </HomeStack.Navigator>
  )
}

const ItemsNavigator = () => {
  return (
    <ItemsStack.Navigator>
      <ItemsStack.Screen name="Collections" component={CollectionList} />
      <ItemsStack.Screen name="New Collection" component={AddCollection} />
      <ItemsStack.Screen name="Item List" component={ItemList} 
        options={({ route }) => ({ 
          title: route.params.collection ?? "Collection",
          headerStyle: {
            backgroundColor: route.params.color,
          },
        })} 
      />
      <ItemsStack.Screen name="Add Item" component={AddItem} 
        options={({ route }) => ({ title: route.params.edit ? "Edit Item Information" : "Add Item" })} 
      />
      <ItemsStack.Screen name="Barcode Scanner" component={BarcodeScanner} />
    </ItemsStack.Navigator>
  )
}

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [theme, setTheme] = useState(null);
  const [user, setUser] = useState(null);
  const themeData = { theme, setTheme };
  const userData = { user, setUser };

  // Get auth status from firebase
  auth.onAuthStateChanged((authUser) => {
      if(!user?.uid && authUser?.uid) {
          // User is signed in, get data
          onValue(ref(
              database, 'users/' + authUser.uid + '/userdata'
          ), (snapshot) => {
              const data = snapshot.val();
              if(data) {
                setUser({...data, ...authUser})
                if(data.theme) setTheme(data.theme)
              }
              setInitialized(true)
          })
      } else if(!authUser?.uid) {
          setUser(null)
          setTheme("light")
          setInitialized(true)
      }
  });

  if(!initialized) {
      return <LoadingScreen />
  }

  return(
    <ThemeContext.Provider value={themeData}>
      <NavigationContainer theme={theme === 'dark' ? InventoryAppDark : InventoryAppLight}>
        {!user?.uid && initialized ? (
          <AuthNavigator
            theme={InventoryAppLight}
            screenOptions={({ route }) => ({
              ...NavigatorStyles,
            })}
          />
        ) : (
          <UserContext.Provider value={userData}>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                ...NavigatorStyles,
                /*headerStyle: { backgroundColor: '#168CAD' },*/
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
          </UserContext.Provider>
        )}
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}